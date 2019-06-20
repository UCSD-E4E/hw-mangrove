from flask import Flask, render_template
from upload_file import upload_file
from readfile import readfile
#from camera_controller import camera_controller
#from take_measurement import take_measurement

app = Flask(__name__)
app.register_blueprint(upload_file)
app.register_blueprint(readfile)
#app.register_blueprint(camera_controller)
#app.register_blueprint(take_measurement)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def main():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()
