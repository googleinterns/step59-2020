import time
import firebase_admin
from firebase_admin import credentials,firestore
import requests
import pandas as pd
cred = credentials.Certificate("integrity-step-capstone-firebase-adminsdk-6oh0x-842f5d86d9.json")

firebase_admin.initialize_app(cred,{
    'storageBucket': 'integrity-step-capstone.appspot.com'
})

firebase_request_adapter = requests.Request()
db = firestore.client()

def atLeastTwo(a,b,c):
    return (b or c) if a else (b and c)

def Config_decorator(func):
    def time_wrapper(*args, **kw):
        start = time.time()
        num = func(*args, **kw)
        end = time.time()
        size = end-start
        rDict ={}
        rDict['Time'] = size
        rDict['NumSym'] = num
        rDict['Industry'] = args[0]
        rDict['Sector'] = args[1]
        rDict['MarketCap'] = args[2]
        return rDict
    return time_wrapper

@Config_decorator
def SpecTicker(Industry,Sector,MarketCap):
    StocksQuery = db.collection("Ticker-Info").document("Stock").collection("Stocks")
    if 'Industry' is not None:
        StocksQuery = StocksQuery.where("Industry","==",Industry)
    if 'Sector'  is not None:
        StocksQuery = StocksQuery.where("Sector","==",Sector)
    if 'MarketCap' is not None:
        StocksQuery = StocksQuery.where("MarketCapSize","==",MarketCap)
    num_of_stocks = 0
    for stock in StocksQuery.stream():
        num_of_stocks+=1
    return num_of_stocks

def Latency():
    Industry_ref = db.collection("Ticker-Info").document("Industry")
    Industry = Industry_ref.get()
    Sector_ref = db.collection("Ticker-Info").document("Sector")
    Sector = Sector_ref.get()
    MarketCap_ref = db.collection("Ticker-Info").document("Market-Cap")
    MarketCap = MarketCap_ref.get()

    MarketCapL = list((MarketCap.to_dict()['MarketCap']).keys())
    SectorL = list((Sector.to_dict()['Sector']).keys())
    IndustryL = list((Industry.to_dict()['Industry']).keys())
    
    MarketCapL.append(None)
    SectorL.append(None)
    IndustryL.append(None)


    QueryNums = len(MarketCapL) * len(IndustryL) * len(SectorL) - 1 - len(SectorL) - len(MarketCapL) - len(IndustryL)
    num = 0
    Latency = {}

    for Industry in IndustryL:
        for Sector in SectorL:
            for MarketCap in MarketCapL:
                if atLeastTwo(Industry,Sector,MarketCap):
                    Latency[num] = SpecTicker(Industry,Sector,MarketCap)
                    num+=1
                    print(f'Query {num}/{QueryNums}')
    LatencyFile =pd.DataFrame.from_dict(Latency, orient='index')
    LatencyFile.sort_values(by=['NumSym'], inplace=True)
    LatencyFile.to_csv("Latency.csv")

Latency()
    
    



