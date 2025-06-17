import traceback
from flask import request, jsonify, session
import requests
from .config import app, db
from .models import User, Dish, Restaurant, Orders, Order_item
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
import stripe
import logging
from functools import wraps
from base64 import b64encode
from dotenv import load_dotenv
import os

load_dotenv()


@app.route('/')
def home():
    return "Welcome to the Food Delivery API!"


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check if there is a logged-in user in the session
        if 'curr_user' not in session:
            return jsonify({"error": "Unauthorized"}), 401  # User not logged in
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 409  # Conflict status

    hashed_password = generate_password_hash(password)
    new_user = User(name=name, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    session['curr_user']=user.to_json_user()
    session.permanent=True
    app.permanent_session_lifetime=timedelta(days=1)

    if user and check_password_hash(user.password, password):
        return jsonify({"message": "Welcome back! You are logged in successfully", 'name':user.name}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401  # Unauthorized status


@app.route('/api/get-user', methods=["GET"])
@login_required
def get_current_user():
    user_data = session.get('curr_user', None)
    if user_data:
        # Fetch the user from the database
        user = User.query.filter_by(email=user_data['email']).first()
        if user:
            # Encode the image as Base64 if it exists
            image_base64 = b64encode(user.image).decode('utf-8') if user.image else None

            # Prepare the response
            user_response = {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "address": user.address,
                "phone_no": user.phone_no,
                "image": image_base64
            }

            return jsonify(user_response), 200

    return jsonify({"message": "Unauthorized"}), 401


@app.route('/api/update-user', methods=['POST'])
def updateUser():
    email = request.form['email']
    address = request.form['address']
    phone_no = request.form['phone_no']
    image = request.files.get('image')
    try:
        # Find the user by email
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({"message": "User not found"}), 404

        # Update address and phone number
        user.address = address
        user.phone_no = phone_no

        # Update image if provided
        if image:
            # filename = secure_filename(image.filename)
            image_data = image.read()  # Read image as binary data
            user.image = image_data
        else:
            user.image = None

        # Commit changes to the database
        db.session.commit()
        db.session.refresh(user)
        user = User.query.filter_by(email=email).first()

        return jsonify({"message": "User updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print("An error occurred:", str(e))
        print(traceback.format_exc())  # Print the full traceback
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500



@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    session.pop('curr_user', None)
    return jsonify({"message": "Logged out"}), 200

@app.route('/api/food-list-admin',methods=['POST'])
def fooddListAdmin():
    rest_name=request.json
    food_list=Dish.query.filter_by(restaurant_name=rest_name)
    json_list=[dish.to_json() for dish in food_list]
    return jsonify({"food_list": json_list})

@app.route('/api/food-list',methods=['GET','POST'])
def foodList():
    if request.method == 'POST':
        name=request.form.get('name')
        image=request.files.get('image')
        restaurant_name=request.form.get('restaurant_name')
        price=request.form.get('price')
        description=request.form.get('description')
        category=request.form.get('category')

        new_item=Dish(
            name=name,
            restaurant_name=restaurant_name,
            image=image.read(),
            price=float(price),
            description=description,
            category=category
            )
        db.session.add(new_item)
        db.session.commit()

        return jsonify({'message':'Item added successfully'}),201
    else:
        food_list=Dish.query.all()
        json_list=[dish.to_json() for dish in food_list]
        return jsonify({"food_list": json_list})
    
@app.route('/api/get-food-list',methods=['POST'])
def getFoodList():
    name=request.json
    food_list=Dish.query.filter_by(restaurant_name=name)
    json_list=[dish.to_json() for dish in food_list]
    unique_dishes = {}
    for dish in food_list:
        if dish.category not in unique_dishes:
            unique_dishes[dish.category] = dish

    menu_list = [dish.to_json() for dish in unique_dishes.values()]
    return jsonify({"food_list": json_list, "menu_list": menu_list})

@app.route('/api/delete-dish',methods=['POST'])
def deleteDish():
    dishID=request.json.get('dishId')
    dish=Dish.query.get(dishID)
    db.session.delete(dish)
    db.session.commit()
    return jsonify({'message': 'Dish removed successfully', 'name': dish.name}), 200

@app.route('/api/restaurant-list',methods=['GET','POST'])
def restaurantList():
    if request.method == 'POST':
        name=request.form.get('name')
        image=request.files.get('image')
        delivery_charge=request.form.get('deliveryCharge')
        category=request.form.get('category')
        open_time=request.form.get('openTime')
        close_time=request.form.get('closeTime')

        new_item=Restaurant(
            name=name,
            image=image.read(),
            delivery_charge=float(delivery_charge),
            category=category,
            open_time=open_time,
            close_time=close_time
            )
        db.session.add(new_item)
        db.session.commit()

        return jsonify({'message':'Restaurant added successfully'}),201
    else:
        list=Restaurant.query.all()
        json_list=[restaurant.to_json() for restaurant in list]
        name_list=[restaurant['name'] for restaurant in json_list]
        return jsonify({"restaurant_list": json_list, "restaurant_names": name_list})

@app.route('/api/filter-rest-list',methods=['POST'])
def filterRestaurant():
    filter = request.json
    list=Restaurant.query.filter_by(category=filter)
    json_list=[restaurant.to_json() for restaurant in list]
    return jsonify({"restaurant_list": json_list})

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/api/ipapi', methods=['GET'])
def proxy_ipapi():
    try:
        response = requests.get("https://ipapi.co/json", timeout=10)
        response.raise_for_status()
        logger.info(f"Response Headers: {response.headers}")  # Log headers
        return jsonify(response.json()), response.status_code
    except requests.exceptions.HTTPError as http_err:
        logger.error(f"HTTP error occurred: {http_err}")
        return jsonify({"error": "HTTP error occurred while fetching location data"}), response.status_code
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching data from ipapi: {e}")
        return jsonify({"error": "Unable to fetch location data"}), 500

@app.route('/api/create-checkout-session', methods=['POST'])
@login_required
def create_checkout_session():
    try:
        data = request.json
        order_id = data.get('order_id')
        cartItem = data.get('items', {})  # Ensure 'cartItem' is present
        shipping_charge = data.get('delivery_charge')  # Fixed shipping charge in your currency unit (e.g., cents)
        tax_enabled = False

        # Prepare line items for checkout
        line_items = []
        for item_id, quantity in cartItem.items():
            food = Dish.query.filter_by(id=item_id).first()
            if food:
                line_items.append({
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': food.name,
                        },
                        'unit_amount': food.price*100,  # Price in smallest currency unit (e.g., cents)
                    },
                    'quantity': quantity,
                })

        # Shipping options
        shipping_options = [{
            'shipping_rate_data': {
                'type': 'fixed_amount',
                'fixed_amount': {
                    'amount': shipping_charge*100,  # Shipping charge in smallest unit
                    'currency': 'usd',
                },
                'display_name': 'Standard Shipping',
            }
        }]

        # Create Checkout Session
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=os.getenv('CLIENT_HOST'),
            cancel_url=os.getenv('CLIENT_HOST'),
            metadata={'order_id': order_id},
            shipping_options=shipping_options,
            automatic_tax={'enabled': tax_enabled},
        )
        app.logger.info(f"Stripe Session Created: {session}")
        app.logger.info(f"Received cartItem: {cartItem}")

        return jsonify({'id': session.id})

    except Exception as e:
        return jsonify({'error': f'Error creating session: {str(e)}'}), 500



@app.route('/api/delete-pending-orders', methods=['DELETE'])
def deletePendingOrders():
    try:
        # Query all orders with 'Pending' status
        pending_orders = Orders.query.filter_by(status='Pending').all()
        if not pending_orders:
            return jsonify({'message': 'No pending orders found'}), 200
        
        # Delete all pending orders (Cascade delete will handle related order_items)
        for order in pending_orders:
            id=order.order_id
            items=Order_item.query.filter_by(order_id=id).all()
            for item in items:
                db.session.delete(item)
            db.session.delete(order)
        
        db.session.commit()  # Commit the changes
        return jsonify({'message': 'All pending orders deleted successfully'}), 200

    except Exception as e:
        print(f"Error: {str(e)}")  # Log the actual exception message
        db.session.rollback()  # Rollback the transaction in case of error
        return jsonify({'message': 'Error deleting pending orders', 'error': str(e)}), 500


@app.route('/api/delete-completed-orders', methods=['DELETE'])
def deleteCompletedOrders():
    delivered_items = Order_item.query.filter_by(status='Delivered').all()
    if not delivered_items:
        return jsonify({'message': 'No completed orders found'}), 200
    for item in delivered_items:
        order_id=item.order_id
        db.session.delete(item)
        orderItem=Order_item.query.filter_by(order_id=order_id).first()
        if not orderItem:
            order=Orders.query.filter_by(order_id=order_id).first()
            if order:
                db.session.delete(order)
    
    db.session.commit()
    return jsonify({'message': 'All completed orders deleted successfully'}), 200




@app.route('/api/get-my-order',methods=['POST'])
@login_required
def getMyOrders():
    email=request.json['email']
    # if not email:
    #     return jsonify({'error': 'Email is required'}), 400
    # print(email)
    my_orders = Orders.query.filter_by(email=email).all()
    # orders_list = [{'id': order.order_id, 'name': order.name, 'price': order.price} for order in my_orders]
    allOrders=[]
    for order in my_orders:
        orders={}
        foodItems=[]
        order_items=Order_item.query.filter_by(order_id=order.order_id)
        for item in order_items:
            curr_item={}
            dish=Dish.query.filter_by(id=item.dish_id).first()
            if not dish:
                continue
            curr_item["item_name"]=dish.name
            curr_item["quantity"]=item.quantity
            curr_item["price"]=dish.price
            curr_item['restaurant']=item.restaurant_name
            curr_item['status']=item.status
            foodItems.append(curr_item)
        orders['orderItems']=foodItems
        orders['price']=order.price
        allOrders.append(orders)
    return jsonify({'orders': allOrders}), 200

@app.route('/api/get-restaurant-order', methods=['POST'])
def getRestaurantOrders():
    restaurant = request.json.get('currRestaurant')
    
    # Query orders with their items for the specified restaurant
    orders = db.session.query(Orders).join(Order_item, Order_item.order_id == Orders.order_id) \
        .filter(Order_item.restaurant_name == restaurant).all()

    all_orders = []

    for order in orders:
        # Build order details
        order_data = {
            'order_id': order.order_id,
            'name': order.name,
            'email': order.email,
            'phno': order.phno,
            'address': order.address,
            'status': '',
            'price': 0,
            'orderItems': {}
        }
        
        # Query order items related to this order and restaurant
        order_items = Order_item.query.filter_by(order_id=order.order_id, restaurant_name=restaurant).all()
        
        for item in order_items:
            dish = Dish.query.get(item.dish_id)
            if dish:
                order_data['orderItems'][dish.name] = {
                    'quantity': item.quantity,
                    # 'status': item.status,  # Include item-specific status if needed
                    'price': dish.price
                }
                order_data['price'] += dish.price * item.quantity
                order_data['status'] = item.status
        
        all_orders.append(order_data)
    
    return jsonify({'orders': all_orders}), 200


@app.route('/api/change-order-status', methods=['POST'])
def changeStatus():
    data=request.json
    new_status=data['new_status']
    order_items = Order_item.query.filter_by(order_id=data['order_id'], restaurant_name=data['currRestaurant']).all()
    for item in order_items:
        item.status=new_status
    db.session.commit()
    return jsonify({'messagge': "status changed successfully"}), 200

@app.route('/api/order', methods=['POST'])
@login_required
def create_order():
    data = request.json['order']
    new_order = Orders(
        name=data['name'],
        email=data['email'],
        phno=data['phone'],
        price=request.json['price'],
        address=data['address'],
        status='Pending'  # Add status field
    )
    db.session.add(new_order)
    db.session.commit()
    for id, quantity in request.json['cartItem'].items():
        rest_name=Dish.query.filter_by(id=id).first().restaurant_name
        newItem = Order_item(order_id=new_order.order_id, restaurant_name=rest_name, dish_id=id, quantity=quantity, status="Order placed")
        db.session.add(newItem)

    db.session.commit()
    return jsonify({'order_id': new_order.order_id, 'message': 'Order created, awaiting payment'})

@app.route('/api/calculate-shipping', methods=['POST'])
def calculateShippingCharge():
    shipping_charge={}
    for id in request.json['cartItem'].keys():
        rest_name=Dish.query.filter_by(id=id).first().restaurant_name
        cost = Restaurant.query.filter_by(name=rest_name).first().delivery_charge
        shipping_charge[rest_name]=cost
    delivery_charge = sum(shipping_charge.values())
    return jsonify({'delivery_charge': delivery_charge})

@app.route('/webhook', methods=['POST'])
def stripe_webhook():
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get('Stripe-Signature')
    
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET'))

    except ValueError as e:
        return 'Invalid payload', 400
    except stripe.error.SignatureVerificationError as e:
        return 'Invalid signature', 400

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        order_id = session['metadata']['order_id']
        order = Orders.query.get(order_id)
        
        if order:
            order.status = 'Completed'
            db.session.commit()
            return 'Order completed successfully', 200
        
        return 'Order not found', 404
    
    # Handle other webhook event types gracefully
    return 'Unhandled event type', 200  # Avoid deletion here for safety

if __name__ == '__main__':
    app.run(debug=True)