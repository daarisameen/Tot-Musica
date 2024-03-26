# Importing necessary modules and functions from Flask and other libraries
# Importing app instance from the application module

from flask import render_template, url_for, flash, redirect, request, abort,jsonify
from application import app
from flask_security import current_user
from mutagen.mp3 import MP3

# Importing render_template function for rendering HTML templates
# Importing MP3 class from mutagen.mp3 module for MP3 file handling

@app.route('/')
def index():
    return render_template("index.html")

# Route for the homepage
# Rendering the index.html template
