# Importing necessary modules and models from the application

# Creating application context to work with database models

# Creating role instances

from application import db, app
from application.models import *

# Querying the user and role from the database

# Checking if user and role exist

with app.app_context():
    role_1 = Role(name='admin', description='Admin')
    role_2 = Role(name='creator', description='Creator')
    role_3 = Role(name='user', description='User')


    user = User.query.filter_by(username='Dummy').first()
    role = Role.query.filter_by(name='creator').first()

    if user and role:
        user.roles.append(role)
        db.session.commit()
        
# Assigning role to user if both user and role exist

# Committing the changes to the database