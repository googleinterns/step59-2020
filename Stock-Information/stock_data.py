import firebase_admin
from flask import Flask, render_template, request
from firebase_admin import credentials,firestore,storage
from Plot import SaveAllImages
from dateutil.relativedelta import relativedelta
import requests
import IntrinsicValue
import yfinance as yf
import datetime
import numpy as np
import json

cred = credentials.Certificate("integrity-step-capstone-firebase-adminsdk-6oh0x-842f5d86d9.json")
firebase_admin.initialize_app(cred,{
    'storageBucket': 'integrity-step-capstone.appspot.com'
})

firebase_request_adapter = requests.Request()

app = Flask(__name__)
app.secret_key = """Xyeo\x06\x97\xc7\xf7\x1c\x84\xcd\x04\x1e\x07`]\x1fA\x83-\x1e#\xeb@"""
app.config['SESSION_TYPE'] = 'filesystem'
app.config['IMAGES'] = 'images/'
db = firestore.client()
bucket = storage.bucket()

'''
Params:
Symbol- A string of the stock symbol
periodLen- 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max
roomId- A string of the roomID
end-date- The last date of the period in format 2017-08-10 00:00:00

Returns:
A success code and it uploads the image to firebase cloud storage.
'''
@app.route('/get-stock-image',methods=['GET'])
def get_stock_image():
    # symbol = request.form['symbol']
    # period = request.form['periodLen']
    # roomID = request.form['RoomId']
    # end_date = request.form['end-date']
    symbol = 'AAPL'
    period = '1Y'
    roomID = 'Room234'
    end_date = str(datetime.date.today())

    SaveAllImages(symbol,end_date,period,roomID)

    RSIblob = bucket.blob(symbol + ' ' + roomID + ' ' +end_date + ' RSI Stock')
    RSIblob.upload_from_filename('images/' + symbol + ' ' + roomID + ' ' +end_date + ' RSI Stock.png')

    MACDblob = bucket.blob(symbol + ' ' + roomID + ' ' +end_date + ' MACD Stock')
    MACDblob.upload_from_filename('images/' + symbol + ' ' + roomID + ' ' +end_date + ' MACD Stock.png')

    ADXblob = bucket.blob(symbol + ' ' + roomID + ' ' +end_date + ' ADX Stock')
    ADXblob.upload_from_filename('images/' + symbol + ' ' + roomID + ' ' +end_date + ' ADX Stock.png')

    Stockblob = bucket.blob(symbol + ' ' + roomID + ' ' +end_date + ' Stock')
    Stockblob.upload_from_filename('images/' + symbol + ' ' + roomID + ' ' +end_date + ' Stock.png')
    expiration_date = datetime.date.today()+ relativedelta(days=2)
    print(expiration_date)
    exp_date_Time = datetime.datetime(
        year=expiration_date.year, 
        month=expiration_date.month,
        day=expiration_date.day,
    )
    img = {
        'RSIpublic_image_url':RSIblob.generate_signed_url(expiration=exp_date_Time,
                                 version='v4'),
        'MACDpublic_image_url':MACDblob.generate_signed_url(expiration=exp_date_Time,
                                 version='v4'),
        'ADXpublic_image_url':ADXblob.generate_signed_url(expiration=exp_date_Time,
                                 version='v4'),
        'Stockpublic_image_url':Stockblob.generate_signed_url(expiration=exp_date_Time,
                                 version='v4'),
    }
    db.collection('Rooms').document(roomID).collection('Symbol').document('RoomSymbols').collection(symbol).document('images').set(img)
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 


'''
Params:
Symbol- A string of the stock symbol
periodLen- 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max
roomId- A string of the roomID
end-date- The last date of the period in format 2017-08-10 00:00:00

Returns:
A success code and it uploads the indicators to cloud storage
'''
@app.route('/get-technical-indicators',methods=['POST'])
def tech_indic():
    symbol = request.form['symbol']
    period = request.form['periodLen']
    roomID = request.form['RoomId']
    end_date = request.form['end-date']
    TechI = IntrinsicValue.getAllTechnicalIndicators(symbol,end_date,period)
    TechDict = TechI.to_dict(orient='index')
    db.collection('Rooms').document(roomID).collection('Symbol').document('RoomSymbols').collection(symbol).document('technical-indicators').set(TechDict)
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

'''
Params:
Symbol-A string of the stock symbol
interval- a string used to fetch data by interval (including intraday if period < 7 days)
• valid intervals: 1m,2m,5m,15m,30m,60m,90m,1h,1d,5d,1wk,1mo,3mo
• (optional, default is '1d')
period-use "period" instead of start/end
• valid periods: 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max
roomId
• The id of the room 
Response:
It creates a json file of the corresponding data, or if the limit's been reached it will queue until the request gets data
'''
@app.route('/get-time-series',methods=['POST'])
def time_series():
    symbol = request.form['symbol']
    period = request.form['periodLen']
    roomID = request.form['RoomId']
    end_date = request.form['end-date']
    stock = yf.Ticker(symbol)
    hist  = stock.history(period=period,end=end_date)
    OpenLi = hist[['Close','Volume']]
    indexes = OpenLi.index.values
    valuesLi = OpenLi.values.tolist()
    indexLi = [np.datetime_as_string(d,unit='m') for d in indexes]
    TimeSeries = dict(zip(indexLi,valuesLi))
    db.collection('Rooms').document(roomID).collection('Symbol').document('RoomSymbols').collection(symbol).document('time-series').set(TimeSeries)
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 
     
if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.

    # Flask's development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.
    app.run(host='localhost', port=8080, debug=True)