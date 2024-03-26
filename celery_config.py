from dotenv import load_dotenv
load_dotenv()
import os

# Importing necessary modules for loading environment variables
# Loading environment variables from a .env file

# Importing os module for accessing environment variables

enable_utc=False
from dotenv import load_dotenv
load_dotenv()
import os

# Setting Celery configuration options

broker_url = os.getenv('CELERY_BROKER_URL')
result_backend = os.getenv('CELERY_RESULT_BACKEND')
timezone = "Asia/Kolkata"
broker_connection_retry_on_startup=True
CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL')
CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND')

# Disabling UTC for timezone awareness
# Retrieving Celery broker URL and result backend from environment variables
# Setting timezone for Celery tasks
# Enabling broker connection retry on startup
# Retrieving Celery broker URL and result backend from environment variables