import IntrinsicValue
import yfinance as yf
import pandas as pd
from datetime import date
import os
import matplotlib.pyplot as plt

'''
Paramaters: 
Data-A pandas dataframe of the closing data for the symbol stock.
Symbol- A string of the stock symbol
roomId- The roomID the stockImage will be used for.(Naming Purposes)
end-date- The last date of the period in format 2017-08-10 00:00:00 (Naming Purposes)
Returns
Nothing.Saves Image of stock data as well as the the EMA and SMA values in line plot form
'''
def getStockImage(data,symbol,roomID,end_date):
    OpenLi = data[['Close']]
    SMA50 = IntrinsicValue.getSMAList(data,50)
    SMA200 =  IntrinsicValue.getSMAList(data,200)
    EMA10 = IntrinsicValue.getEMAList(data,10)
    OpenLi.rename(columns ={"Close":"Price"},inplace=True)
    StockPlot = pd.concat([OpenLi,EMA10,SMA50,SMA200],axis=1)
    cols = ['Price','10 Day EMA','50 Day SMA','200 Day SMA']
    colors = ['green','#FF0000','#FCFF00','#FFA600']
    StockPlot[cols].plot(color=colors)
    name = 'images/' + symbol + ' ' + roomID + ' ' +end_date + ' Stock.png'
    plt.savefig(name)

'''
Paramaters: 
Data-A pandas dataframe of the closing data for the symbol stock.
Symbol- A string of the stock symbol
roomId- The roomID the stockImage will be used for.(Naming Purposes)
end-date- The last date of the period in format 2017-08-10 00:00:00 (Naming Purposes)
Returns
Nothing.Saves Image of MACD data and signal data in line plot form.
'''
def getMACDImage(data,symbol,roomID,end_date):
    StockPlot = IntrinsicValue.getMACDList(data)
    cols = ['MACD','Signal']
    colors = ['green','yellow']
    StockPlot[cols].plot(color=colors)
    name = 'images/' + symbol + ' ' + roomID + ' ' +end_date + ' MACD Stock.png'
    plt.savefig(name)

'''
Paramaters: 
Data-A pandas dataframe of the closing data for the symbol stock.
Symbol- A string of the stock symbol
roomId- The roomID the stockImage will be used for.(Naming Purposes)
end-date- The last date of the period in format 2017-08-10 00:00:00 (Naming Purposes)
Returns
Nothing.Saves Image of ADX data and positive and negative directional indicators in line plot form.
'''
def getADXImage(data,symbol,roomID,end_date):
    StockPlot = IntrinsicValue.getADXList(data)
    cols = ['neg_directional_indicator','pos_directional_indicator','adx']
    colors = ['red','green','black']
    StockPlot[cols].plot(color=colors)
    name = 'images/' + symbol + ' ' + roomID + ' ' +end_date +' ADX Stock.png'
    plt.savefig(name)

'''
Paramaters: 
Data-A pandas dataframe of the closing data for the symbol stock.
Symbol- A string of the stock symbol
roomId- The roomID the stockImage will be used for.(Naming Purposes)
end-date- The last date of the period in format 2017-08-10 00:00:00 (Naming Purposes)
Returns
Nothing.Saves Image of RSI data ain line plot form.
'''

def getRSIImage(data,symbol,roomID,end_date):
    RSI = IntrinsicValue.getRSIList(data,14)
    StockPlot = pd.DataFrame(columns=['RSI', 'Overbought', 'Oversold'])
    StockPlot['RSI'] = RSI
    StockPlot['Overbought'] = 70
    StockPlot['Oversold'] = 30
    cols = ['RSI','Overbought','Oversold']
    colors = ['black','green','red']
    print(StockPlot)
    StockPlot[cols].plot(color=colors)
    name = 'images/' + symbol + ' ' + roomID + ' ' +end_date + ' RSI Stock.png'
    plt.savefig(name)
'''
Paramaters: 
Data-A pandas dataframe of the closing data for the symbol stock.
Symbol- A string of the stock symbol
period- 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max
roomId- The roomID the stockImage will be used for.(Naming Purposes)
end-date- The last date of the period in format 2017-08-10 00:00:00 
Returns
Nothing.Saves Image of all stock related images
'''
def SaveAllImages(symbol,end_date,period,roomID):
    stock = yf.Ticker(symbol)
    data = stock.history(period=period,end = end_date, interval="1D")
    getADXImage(data,symbol,roomID,end_date)
    getMACDImage(data,symbol,roomID,end_date)
    getRSIImage(data,symbol,roomID,end_date)
    getStockImage(data,symbol,roomID,end_date)
