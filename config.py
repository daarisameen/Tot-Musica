# Configuration class with application settings

# Setting authentication header for token-based authentication
# Setting password salt for security
# Setting JWT secret key for token encoding and decoding
# Setting secret key for CSRF protection and session management

class Config(object):
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'
    SECURITY_PASSWORD_SALT = '31352480363346786718930794834546224821'
    JWT_SECRET_KEY = '2dbd8cd59405a2b9c2858016cdc9e329'
    SECRET_KEY = 'e861bbc266c45fa9c9523ab8e9828209'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///project.sqlite3'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = 'application/static/audios'
    WTF_CSRF_ENABLED = False
    
# Setting SQLAlchemy database URI
# Disabling SQLAlchemy modification tracking
# Setting upload folder for audio files
# Disabling CSRF protection for WTForms