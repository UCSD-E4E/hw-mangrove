# Responsible for uploading files
import os
from flask import Blueprint, request, redirect, url_for, send_from_directory, render_template, jsonify, flash, current_app as app, Response
from werkzeug.utils import secure_filename

import io
import picamera
import logging
import SocketServer
from threading import Condition

camera_controller = Blueprint('camera_controller', __name__)

camera = None
output = None
camera_is_enabled  = False

class StreamingOutput(object):
    def __init__(self):
        self.frame = None
        self.buffer = io.BytesIO()
        self.condition = Condition()

    def write(self, buf):
        if buf.startswith(b'\xff\xd8'):
            # New frame, copy the existing buffer's content and notify all
            # clients it's available
            self.buffer.truncate()
            with self.condition:
                self.frame = self.buffer.getvalue()
                self.condition.notify_all()
            self.buffer.seek(0)
        return self.buffer.write(buf)

@camera_controller.route('/toggle_camera', methods = ['GET','POST'])
def toggle_camera():
    print "called toggle_camera in the python"
    global camera
    global output
    global camera_is_enabled
    if request.method == "POST":
        #determine whether or not to display the camera
        if camera_is_enabled:
            print "stopping the camera"
            camera.stop_recording()
            camera_is_enabled = False
            camera.close()
        else:
            print "starting the camera"
            camera = picamera.PiCamera(resolution='320x240', framerate=12)
            camera.start_recording(output, format='mjpeg')
            camera_is_enabled = True
    return jsonify(result="Success")

'''
Generates frames forever
'''
def generateFrames():
    global output
    output = StreamingOutput()

    while True:
        #wait for a frame to be available
        with output.condition:  
            output.condition.wait()
            frame = output.frame
        if camera_is_enabled:
            yield (b'--frame\r\n' 
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        else:
            pass
    
'''
Provide a source for stream.mjpg by using the pi camera
'''
@camera_controller.route('/stream.mjpg')
def getStream():
    return Response((generateFrames()), mimetype='multipart/x-mixed-replace; boundary=frame')
