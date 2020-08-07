import pandas as pd
import json
import webbrowser
import os
import time
import math
from pathlib import Path
from dateutil.relativedelta import relativedelta
import datetime
from datetime import date
from firebase_admin import credentials,firestore
from random import randrange
import firebase_admin
import numpy as np
import yfinance as yf


cred = credentials.Certificate("integrity-step-capstone-firebase-adminsdk-6oh0x-842f5d86d9.json")
firebase_admin.initialize_app(cred,{
    'storageBucket': 'integrity-step-capstone.appspot.com'
})

db = firestore.client()


NASDAQ =  pd.read_csv("companylistNASDAQ.csv")
NYSE =  pd.read_csv("companylistNYSE.csv")

# Merging the NASDAQ and NYSE database
StockEx = NASDAQ.append(NYSE)
StockEx = StockEx.dropna(subset=['IPOyear'])
StockEx = StockEx.drop_duplicates()
# We want at least 2 years worth of data to work with not including the present year
# So we always delete data before that.
IPOCutoff = datetime.date.today() - relativedelta(years=3)
StockEx =  StockEx[StockEx.IPOyear <= IPOCutoff.year]
num = 0
size = len(StockEx.index)
for (index,stock) in StockEx.iterrows(): 
    num+=1
    symb = stock.Symbol
    IPO  = int(stock.IPOyear)
    data  = yf.Ticker(symb)
    end_year = date.today().year
    end_date = datetime.datetime(end_year, 1, 1)
    start_date = datetime.datetime(IPO+1,1,1)
    str_end = end_date - relativedelta(days=1)
    hist = pd.DataFrame()
    try:
        hist = data.history(start = start_date,end=end_date)
    except:
        print("An exception occurred.")
    if hist.empty:
        print(f"No data for this Ticker {symb}. \n Will be deleted")
        try:
          StockEx = StockEx.drop(index)
        except KeyError:
          print("An exception occurred")
    else:
        delta  = hist.head(1).index.tolist()[0].to_pydatetime() -start_date
        if delta.days > 3 or str(hist.tail(1).index.tolist()[0]) != str(str_end):
            print(f"Symbol {symb} will be deleted")
            StockEx = StockEx.drop(index)
        else:
            print(f"Symbol {symb} will not be deleted")
    print(f'Current : {num}/{size}')

Industry =  StockEx['industry'].drop_duplicates().reset_index(drop=True)
Sector = StockEx['Sector'].drop_duplicates().reset_index(drop=True)

Stock = StockEx.drop_duplicates()
# If the IPO year is N/A it means it was established earlier than 1972.
#Market Cap Code
'''
This is a little more complicated than the Industry and Sector versions
because we can't easily query with
Pandas Dataframe because of the method it is stored
'''
TickersMarket = Stock[["MarketCap","Symbol"]]
TickersMarket.fillna(-1,inplace=True)
MarketCapSymbolD ={}
MarketCapD ={
    "Mega-Cap":0,
    "Large-Cap":0,
    "Mid-Cap":0,
    "Small-Cap":0,
    "Micro-Cap":0,
    "Nano-Cap":0,
}
for (index,stock) in TickersMarket.iterrows():
    if stock.MarketCap is not -1:
        curr_cap = float(str(stock.MarketCap)[1:-1])/1000.0 if str(stock.MarketCap)[-1] is "M" else float(str(stock.MarketCap)[1:-1])
        if curr_cap  >= 200 :
            MarketCapSymbolD[stock.Symbol] = "Mega-Cap"
            MarketCapD["Mega-Cap"] += 1
        elif curr_cap >= 10:
            MarketCapSymbolD[stock.Symbol] = "Large-Cap"
            MarketCapD["Large-Cap"] += 1
        elif curr_cap >= 2:
            MarketCapSymbolD[stock.Symbol] = "Mid-Cap"
            MarketCapD["Mid-Cap"] += 1
        elif curr_cap >= 0.3:
            MarketCapSymbolD[stock.Symbol] = "Small-Cap"
            MarketCapD["Small-Cap"] += 1
        elif curr_cap >= 0.05:
            MarketCapSymbolD[stock.Symbol] = "Micro-Cap"
            MarketCapD["Micro-Cap"] += 1
        else:
            MarketCapSymbolD[stock.Symbol] = "Nano-Cap"
            MarketCapD["Nano-Cap"] += 1
    else:
        MarketCapSymbolD[stock.Symbol] = "N/A"
MarketCapDictL = {}
for (key,value) in MarketCapD.items():
    MarketCapDictL[key] = range(value)

StockD =  Stock.reset_index(drop=True).to_dict(orient='index')

StockD = {str(k):v for (k,v) in StockD.items()}
StockV = StockD.values()
i = 0
random_pos = range(len(StockV))
curr_len = len(random_pos)

IndustryList = Industry.values.tolist()
SectorList = Sector.values.tolist()


IndD ={}
SectorD = {}
curr_IndL = {}
curr_SectorL = {}

#These loops get the number of stocks in each industry and sector and
# make lists to use to randomly assign a position.
for ind in IndustryList:
    stocks = Stock[Stock.industry == ind]
    if stocks.empty is not True:
        IndD[ind] = range(len(stocks.index))
        curr_IndL[ind] = len(IndD[ind])

for sect in SectorList:
    stocks = Stock[Stock.Sector == sect]
    if stocks.empty is not True:
        SectorD[sect] = range(len(stocks.index))
        curr_SectorL[sect] = len(SectorD[sect])

StocksD = {
    "NumOfStocks": curr_len,
}

IndD.pop(np.nan,None)
SectorD.pop(np.nan,None)
curr_IndL.pop(np.nan, None)
curr_SectorL.pop(np.nan,None)

IndDocument = {
    "Industry":curr_IndL
}
SectorDocument ={
    "Sector":curr_SectorL
}
MarketCapDocument = {
    "MarketCap":MarketCapD
}
db.collection('Ticker-Info').document('Industry').set(IndDocument)
db.collection('Ticker-Info').document('Sector').set(SectorDocument)
db.collection('Ticker-Info').document('Stock').set(StocksD)
db.collection('Ticker-Info').document('Market-Cap').set(MarketCapDocument)

for Info in StockV:
    NewD = {
        'Symbol': Info['Symbol'],
        'Name': Info['Name'],
        'MarketCap': Info['MarketCap'],
        'IPOyear': Info['IPOyear'],
        'Sector': Info['Sector'],
        'Industry': Info['industry'],
        'MarketCapSize': MarketCapSymbolD[Info['Symbol']],
        # Used to increase ease of querying
        'RandomPos' :random_pos[randrange(curr_len)],
        "MarketCapPos": -1 if MarketCapSymbolD[Info['Symbol']] is "N/A" else MarketCapDictL[MarketCapSymbolD[Info['Symbol']]][randrange(MarketCapD[MarketCapSymbolD[Info['Symbol']]])],
        'IndustryPos': -1 if Info['industry'] is np.nan or Stock[Stock.industry == Info['industry']].empty else IndD[Info['industry']][randrange(curr_IndL[Info['industry']])],
        'SectorPos' : -1 if Info['Sector'] is np.nan or Stock[Stock.Sector == Info['Sector']].empty else SectorD[Info['Sector']][randrange(curr_SectorL[Info['Sector']])]
    }
    db.collection('Ticker-Info').document('Stock').collection('Stocks').document(Info['Symbol']).set(NewD)
    i+=1
    curr_len-=1
    if Info['industry'] is not np.nan:
        curr_IndL[Info['industry']]-=1
    if Info['Sector'] is not np.nan:
        curr_SectorL[Info['Sector']]-=1
    if MarketCapSymbolD[Info['Symbol']] is not "N/A":
        MarketCapD[MarketCapSymbolD[Info['Symbol']]]-=1
    print(str(i)+ "\\" + str(len(StockV)) + ":" + Info['Symbol'] +" has been added to the database with IPO year " +  str(Info['IPOyear']))
