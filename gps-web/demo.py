import sys
import random
from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
BASECOORDS = [33.0737, -117.1642]    

def get_latlong():
    try :
        if (rep["class"] == "TPV") :
                return (str(rep.lat) + "," + str(rep.lon))
    except Exception as e :
        return("Couldn't find GPS Signal")
@app.route('/')
def index():
    return render_template('index.html', coordinates = BASECOORDS)

@app.route('/savelocation')
def location():
    return render_template('location.html', coordinates = BASECOORDS)

@app.route('/background_rtk')
def background_rtk():
    print("hello this is working")
    return "nothing"
@app.route('/current_loc')
def current_loc():
    print("this is working as well")
    return "nothing"
if __name__ == '__main__':
    app.run(debug=True)
