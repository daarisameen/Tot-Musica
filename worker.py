# Importing necessary libraries and modules
# Celery for asynchronous task execution
# Redis for caching
# Configuration for Celery
# Loading environment variables from a .env file
# Operating System module for environment variables


from celery import Celery, Task
import redis
import celery_config as celery_config
from dotenv import load_dotenv
import os
load_dotenv()
redis_host = os.getenv('CACHE_REDIS_HOST')
CACHE_REDIS_PORT= os.getenv('CACHE_REDIS_PORT')
CACHE_REDIS_PASSWORD= os.getenv('CACHE_REDIS_PASSWORD')

# Retrieving Redis host, port, and password from environment variables
# Connecting to Redis server
# Initializing Celery application with Flask integration


r = redis.Redis(
  host=redis_host,
  port=CACHE_REDIS_PORT,
  )

def celery_init_app(app):
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object(celery_config)
    return celery_app
  
# Custom Task class to execute tasks within Flask application context

# Creating Celery application instance

# Configuring Celery application from celery_config module