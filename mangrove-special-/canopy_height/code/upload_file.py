# Responsible for uploading files
import os
import simplejson as json
from flask import Blueprint, request, redirect, url_for, send_from_directory, render_template, jsonify, flash, current_app as app
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'js', 'py', 'json'])
upload_file = Blueprint('upload_file', __name__)

def allowed_file(filename):
    return True
    # Edit if want to change 
    # return '.' in filename and \
        # filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_file.route('/upload', methods = ['GET','POST'])
def upload():
    if request.method == 'POST':
        # if 'file' not in request.files:
        #     # flash("No file part")
        #     return jsonify(result='No file part')
        # file = request.files['file']
        # if file.filename == '':
        #     # flash('No selected file')
        #     return jsonify(result='No file selected')
        # if file and allowed_file(file.filename):
        #     filename = secure_filename(file.filename)
        #     with open(os.path.join(app.config['UPLOAD_FOLDER'],filename),"a") as fo:
        #         json.dump(request.form, fo)
        #         fo.write('\n')
        #     return jsonify(result="Success")
        if 'fileName' not in request.form:
            return jsonify(result='No file part')
        filename = secure_filename(request.form.get('fileName'))
        filelocation = request.form.get('fileLocation')
        if filename == '':
            return jsonify(result='No file name')
        if filelocation == '':
            return jsonify(result="File path error")
        if allowed_file(filename):
            try:
                # with open(os.path.join(app.config['UPLOAD_FOLDER'], filename),"a") as fo:
                with open(os.path.join(request.form.get('fileLocation'), filename),"a") as fo:
                    json.dump(request.form.get('data'), fo)
                    fo.write('\n')
            except EnvironmentError:
                return jsonify(result='File path error')
            return jsonify(result='Success')
        return jsonify(result='File not allowed')

@upload_file.route('/uploads/<filename>', methods = ['GET','POST'])
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

