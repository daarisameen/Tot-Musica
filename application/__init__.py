# Importing necessary modules

# Importing Flask and related modules
# Importing SQLAlchemy for database operations
# Importing Migrate for database migrations
# Importing LoginManager for user authentication
# Importing Config class from config module
# Importing Flask-CORS for Cross-Origin Resource Sharing
# Importing Security for user authentication and authorization
# Importing JWTManager for JWT token handling

import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from config import Config
from sqlalchemy.sql import func 
from flask_cors import CORS
from flask_security import Security
from flask_jwt_extended import JWTManager

# Creating Flask application instance
# Enabling CORS support for the Flask application
# Loading configuration from Config class

# Creating SQLAlchemy database instance
# Creating Migrate instance for database migrations

app = Flask(__name__, template_folder='templates')
CORS(app)
app.config.from_object(Config)


db = SQLAlchemy(app)
migrate = Migrate(app, db)

# from .sec import datastore
# app.security = Security(app, datastore)


# from application.models import User, Song, Album, Artist, Playlist, Interactions

jwt = JWTManager(app)

from application.resources import api
api.init_app(app)



from application import views

# Initializing JWTManager for JWT token handling

# Importing API resources from application.resources module
# Initializing API with Flask application instance

# Importing views module from application package