from .config import db
from base64 import b64encode


class User(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    image=db.Column(db.LargeBinary)
    name=db.Column(db.String(100))
    address=db.Column(db.String(200))
    email=db.Column(db.String(100),unique=True)
    phone_no=db.Column(db.String(50))
    password=db.Column(db.String(500))

    def to_json_user(self):
        image_base64 = b64encode(self.image).decode('utf-8') if self.image else None
        return {
            "id": self.id,
            "image": image_base64,
            "name": self.name,
            'address':self.address,
            "email": self.email,
            "phone_no": self.phone_no,
            "password": self.password,
        }
    
class Restaurant(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(200))
    image=db.Column(db.LargeBinary)
    delivery_charge=db.Column(db.Integer) 
    category=db.Column(db.String(100))
    open_time = db.Column(db.Time, nullable=False)  # Store as Time object
    close_time = db.Column(db.Time, nullable=False)  # Store as Time object

    def to_json(self):
        open_minutes = self.open_time.hour * 60 + self.open_time.minute
        close_minutes = self.close_time.hour * 60 + self.close_time.minute

        return {
            "id": self.id,
            "name": self.name,
            "image": b64encode(self.image).decode('utf-8'),
            "delivery_charge": self.delivery_charge,
            "category": self.category,
            "open_time": open_minutes,  # Send as number of minutes
            "close_time": close_minutes  # Send as number of minutes
        }

    
class Dish(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(100))
    restaurant_name=db.Column(db.String(150))
    image=db.Column(db.LargeBinary)
    price=db.Column(db.Integer) 
    description=db.Column(db.String(500))
    category=db.Column(db.String(100))

    def to_json(self):
        return {
            "_id": self.id,
            "name": self.name,
            "restaurant_name": self.restaurant_name,
            "image": b64encode(self.image).decode('utf-8'),  # Convert image to Base64
            "price": self.price,
            "description": self.description,
            "category": self.category,
        }
    

class Orders(db.Model):
    order_id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(100))
    email=db.Column(db.String(100))
    phno=db.Column(db.String(50)) 
    price=db.Column(db.Integer) 
    address=db.Column(db.String(200))
    status = db.Column(db.String(100))

    def to_json(self):
        return {
            'order_id':self.order_id,
            'name':self.name,
            'email':self.email,
            'phno':self.phno,
            'price':self.price,
            'address':self.address,
            'status': self.status
        }
    

class Order_item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, nullable=False)
    restaurant_name = db.Column(db.String(100))
    dish_id = db.Column(db.Integer, nullable=False)  # Cascade delete for dish
    quantity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(100))

    # order = db.relationship('Orders', backref=db.backref('order_items', lazy=True), cascade="all, delete")  # Cascade delete
    # dish = db.relationship('Dish', backref=db.backref('order_items', lazy=True), cascade="all, delete")

    def to_json(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'restaurant_name': self.restaurant_name,
            'dish_id': self.dish_id,
            'quantity': self.quantity,
            'status': self.status,
            'dish': {
                "name": self.dish.name,
                "price": self.dish.price,
                "description": self.dish.description
            }
        }

