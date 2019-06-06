# Responsible for reading data
import os
import glob
import simplejson as json
from flask import Blueprint, request, redirect, url_for, send_from_directory, render_template, jsonify
from werkzeug.utils import secure_filename
from sqlalchemy import create_engine, select
from mangroves_data import entries

readfile = Blueprint('readfile', __name__)

@readfile.route('/readfile', methods = ['GET'])
def read():
    if request.method == 'GET':
        folder = './uploads/'
        data = ''
        # Stack overflow user: Jay(
        # https://stackoverflow.com/questions/168409/how-do-you-get-a-directory-listing-sorted-by-creation-date-in-python
        files = filter(os.path.isfile, glob.glob(folder+"*"))
        files = list(sorted(files, key=lambda x: os.path.getmtime(x)))
        engine = create_engine('sqlite:///mangroves_database.db', convert_unicode=True)
        conn = engine.connect()
        res = conn.execute(entries.select().order_by(entries.c.time.desc()))
        data = json.dumps([dict(r) for r in res])
        # for filename in files:
            # with open(filename,"r") as fo:
            #     for i, line in enumerate(fo, start=1):
            #         data = data + line
        if data == '':
            return jsonify(result='Error')
        return jsonify(result="Success", data = data)
        
            