from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta
import stripe
# from flask_migrate import Migrate
from flask_cors import CORS


app = Flask(__name__)
app.secret_key = "y8fcubw8379"

CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:@localhost:3306/fooddelivery"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
stripe.api_key = 'sk_test_51QTRWDANLnHBARIdz94KOUsbiT7EANWapIsw5sH6KAGN7sw81ne9AVX4kx5TGYrtFgKVW3fCiTVUT9teu34akcdE00ctXvUF8s'

db = SQLAlchemy(app)
# migrate = Migrate(app, db)

