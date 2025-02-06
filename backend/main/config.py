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
stripe.api_key = 'sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'

db = SQLAlchemy(app)
# migrate = Migrate(app, db)

