from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta
import stripe
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")

CORS(app, supports_credentials=True, origins=[
    os.getenv("CLIENT_HOST"),
    os.getenv("ADMIN_HOST")
])

app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

db = SQLAlchemy(app)
