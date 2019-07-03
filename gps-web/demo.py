import sys
import gps
import random
import requests
import datetime
import multiprocessing
from sys import argv
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template, jsonify


app = Flask(__name__)
BASECOORDS = [33.0737, -117.1642]    


session = gps.gps("localhost", "2947")
session.stream(gps.WATCH_ENABLE | gps.WATCH_NEWSTYLE)

def get_latlong():
    try :
        if (rep["class"] == "TPV") :
                return (rep.lat , rep.lon)
    except Exception as e :
        return 0,0

@app.route('/')
def index():
    lat, lon = get_latlong()
    if (lat == 0 and lon == 0):
        return render_template('notfound.html')
    else:
        return render_template('index.html', coordinates = [lat,lon])

@app.route('/savelocation')
def location():
    lat, lon = get_latlong()
    if (lat == 0 and lon == 0):
        return render_template('points.html', coordinates = BASECOORDS)
    else:
        return render_template('index.html', coordinates = [lat,lon])
    

'''
@app.route('/savedpoints')
def location():
    return render_template('points.html', coordinates = BASECOORDS)
'''

@app.route('/background_rtk')
def background_rtk():
    print("hello this is working")
    return "nothing"
    
@app.route('/stop_rtk')
def stop_rtk():
    print("hello this is working")
    return "nothing"

@app.route('/current_loc')
def current_loc():
    print("this is working as well")
    return "nothing"

if __name__ == '__main__':
    app.run(debug=True)
