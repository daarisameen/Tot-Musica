# Importing necessary libraries and modules
# for email encoding and attachment handling
# for SMTP functionality
# Importing Album model from application.models module

from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.text import MIMEText
import smtplib
from application.models import Album

# Function to retrieve CSV details for a given creator ID

# Importing necessary modules for accessing environment variables
# Loading environment variables from a .env file

def csv_details(creator_id):
    albums = Album.query.filter_by(creator_id=creator_id).all()
    res=[]
    for album in albums:
        res.append((album.id,album.name,album.genre,album.artist_name,album.album_songs))

    return res

import os
from dotenv import load_dotenv
load_dotenv()

# Function to send email with or without attachment

def send_email(to_address, subject, message, attachment_path=None):

    SMPTP_SERVER_HOST = 'smtp.gmail.com'
    SMPTP_SERVER_PORT = 587
    SENDER_ADDRESS = os.getenv('sender_email')
    SENDER_PASSWORD = os.getenv('email_app_password')
    msg = MIMEMultipart()
    msg['From'] = SENDER_ADDRESS
    msg['To']=to_address
    msg['Subject'] = subject
    msg.attach(MIMEText(message, 'plain'))

    if attachment_path:
        with open(attachment_path, "rb") as attachment:
            part = MIMEApplication(attachment.read(), Name=os.path.basename(attachment_path))
            part['Content-Disposition'] = f'attachment; filename="{os.path.basename(attachment_path)}"'
            msg.attach(part)

    try:
        s = smtplib.SMTP(host=SMPTP_SERVER_HOST,port=SMPTP_SERVER_PORT)
        s.starttls()
        s.login(SENDER_ADDRESS,SENDER_PASSWORD)
        s.send_message(msg)
        s.quit()
        return True
    except Exception as e:
        print(e)
        return False
    

def get_users():
    from application.models import User
    users=User.query.all()
    res=[]
    for user in users:
        res.append(user.email)
    return res

# Function to retrieve email addresses of all users