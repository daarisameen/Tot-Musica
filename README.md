### Flask - Virtual Env (MacOs)
python3 -m venv <name of environment>
source <name of environment>/bin/activate
pip install -r requirements.txt

### Flask - Virtual Env (Windows)
python -m venv <name of environment>
<name of environment>\Scripts\activate
pip install -r requirements.txt


### Separately Install Following Packages
Flask==3.0.0
Flask-SQLAlchemy==3.1.1
Flask-Migrate==4.0.5
Flask-Login==0.6.3
Flask-Cors==4.0.0
Flask-Security-Too==5.3.2
Flask-JWT-Extended==4.6.0
Flask-RESTful==0.3.10
mutagen==1.47.0
Flask-Caching==2.1.0
python-dotenv==1.0.0
celery==5.3.6
redis==5.0.1
 
### To start the redis
```redis-server```

### To start your Celery App
````celery -A schedules worker -B -l info```

### About
Me: https://www.linkedin.com/in/daaris/ 
PPT Presentation: https://docs.google.com/presentation/d/1LrBXlgOCQ68NiJwY4Y00TC68eCFqHKDww8vR4-tW-sc/edit?usp=sharing
Video Demo: 