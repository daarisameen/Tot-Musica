# Importing necessary modules and models from the application
# Importing JWTManager for JWT token handling
# Importing cache from app_cache module
# Importing send_email function from utils module
# Importing celery_init_app function from worker module

from application import app, db
from flask import render_template
from application.models import User, Role
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from app_cache import cache
from utils import send_email
from worker import celery_init_app
with app.app_context():
    db.create_all()
    
# Creating application context to initialize database
# Creating all tables in the database

# Initializing Celery application with Flask integration
# Initializing cache for the Flask application

celery_app = celery_init_app(app)
cache.init_app(app)

from schedules import create_csv
from flask import jsonify
@app.get('/download-csv')
def csv_download():
    import time 
    task = create_csv.delay()
    return jsonify({"task-id": task.id})   

# Importing create_csv function from schedules module
# Importing jsonify for creating JSON responses

# Endpoint for initiating CSV download task asynchronously
# Initiating CSV download task and returning task ID

@app.route('/download-csv')
@jwt_required()
def export_csv():
    current_user_id = get_jwt_identity()
    from schedules import create_csv
    task=create_csv.apply_async(args=[current_user_id])
    return jsonify({"task_id":task.id}), 200

# Endpoint for initiating CSV export task with JWT authentication
# Initiating CSV export task with current user ID and returning task ID

# Endpoint for checking CSV generation task status and downloading CSV file
# Checking task status and returning task state or sending CSV file if task is successful

@app.route('/get-csv/<task_id>')
def get_csv(task_id):
    from celery.result import AsyncResult
    from schedules import create_csv
    from flask import send_file
    task=create_csv.AsyncResult(task_id)
    if task.state == 'PENDING':
        return jsonify({"task_state":task.state}), 200
    elif task.state == 'SUCCESS':
        return send_file(f'../report.csv', as_attachment=True)
    else:
        return jsonify({"task_state":task.state}), 200


if __name__ == '__main__':
    app.run(debug = True) 

# Running the Flask application in debug mode if executed as the main module
