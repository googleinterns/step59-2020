import pandas as pd
import json
import webbrowser
import os
import time
from pathlib import Path
from firebase_admin import credentials,firestore
import firebase_admin



cred = credentials.Certificate("integrity-step-capstone-firebase-adminsdk-6oh0x-842f5d86d9.json")
firebase_admin.initialize_app(cred,{
    'storageBucket': 'integrity-step-capstone.appspot.com'
})

db = firestore.client()

def get_download_path():
    """Returns the default downloads path for linux or windows"""
    if os.name == 'nt':
        import winreg
        sub_key = r'SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders'
        downloads_guid = '{374DE290-123F-4565-9164-39C4925E467B}'
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, sub_key) as key:
            location = winreg.QueryValueEx(key, downloads_guid)[0]
        return location
    else:
        return str(os.path.join(Path.home(), "Downloads"))
path = get_download_path()
print(path)
ans = input("Is this your download Path? Type Yes or paste your actual Download Path:")
if ans.lower() != 'y' and ans.lower() != 'yes':
    path = ans
if path[-1]  is '/':
    path[:-1]

webbrowser.open("https://old.nasdaq.com/screening/companies-by-name.aspx?letter=0&exchange=nasdaq&render=download")
time.sleep(3)
NASDAQ =  pd.read_csv(path  +"/companylist.csv")
os.remove(path +"/companylist.csv")
webbrowser.open("https://old.nasdaq.com/screening/companies-by-name.aspx?letter=0&exchange=nyse&render=download")
time.sleep(3)
NYSE =  pd.read_csv(path + "/companylist.csv")
os.remove(path +"/companylist.csv")

StockEx = NASDAQ.append(NYSE)

Industry =  StockEx['industry'].drop_duplicates().reset_index(drop=True)
Sector = StockEx['Sector'].drop_duplicates().reset_index(drop=True).to_dict()
Stock = StockEx.drop_duplicates().reset_index(drop=True).to_dict(orient='index')




db.collection('Ticker-Info').document('Industry').set({str(k):v for (k,v) in Industry.items()})
db.collection('Ticker-Info').document('Sector').set({str(k):v for (k,v) in Sector.items()})

Stock = {str(k):v for (k,v) in Stock.items()}

for Info in Stock.values():
    NewD = {
        Info['Symbol']:
        {
            'Name': Info['Name'], 
            'LastSale': Info['LastSale'],
            'MarketCap': Info['MarketCap'],
            'IPOyear': Info['IPOyear'],
            'Sector': Info['Sector'],
            'industry': Info['industry'], 
            'Summary Quote': Info['Summary Quote']
        }
    }
    db.collection('Ticker-Info').document('Stock').collection('Stocks').document(Info['Symbol']).set(NewD)




