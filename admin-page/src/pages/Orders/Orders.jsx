import React, { useContext, useEffect, useState } from "react";
import "./orders.css";
import { StoredContext } from "../../context";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { currRestaurant } = useContext(StoredContext);

  async function handleStatusChange(e, order_id) {
    const new_status = e.target.value;
    // if (
    //   !window.confirm(
    //     `Are you sure you want to change the status to "${new_status}"?`
    //   )
    // )
    //   return;
    const response = await fetch(`${VITE_API_BASE_URL}/change-order-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id, currRestaurant, new_status }),
    });

    if (new_status === "Delivered") {
      const deleteResponse = await fetch(
        `${VITE_API_BASE_URL}/delete-completed-orders`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  // Map over the orders array to create order elements
  const orderElements = orders.map((item, index) => (
    <div className="order-block" key={index}>
      <div className="order-header">
        <h3>Order #{item.order_id}</h3>
        <div className="status-container">
          <select
            name="status"
            className="status"
            defaultValue={item.status}
            onChange={(e) => handleStatusChange(e, item.order_id)}
          >
            <option value="Order placed">Order placed</option>
            <option value="Out for delivery">Out for delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div className="customer-info">
        <p>
          <strong>Customer:</strong> {item.name}
        </p>
        <p>
          <strong>Email:</strong> {item.email}
        </p>
        <p>
          <strong>Phone:</strong> {item.phno}
        </p>
        <p>
          <strong>Address:</strong> {item.address}
        </p>
      </div>

      <div className="food-item-list">
        {Object.keys(item.orderItems).map((key) => (
          <div className="order-food-item" key={key}>
            <p className="food-name">{key}</p>
            <p className="food-quantity">
              Quantity: {item.orderItems[key].quantity}
            </p>
            <p className="food-price">Price: ${item.orderItems[key].price}</p>
          </div>
        ))}
      </div>

      <div className="total-price">
        <p>Total: ${item.price}</p>
      </div>
    </div>
  ));

  // Fetch orders data from the backend
  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await fetch(
          `${VITE_API_BASE_URL}/get-restaurant-order`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currRestaurant }),
          }
        );
        if (response.ok) {
          const result = await response.json();
          setOrders(result.orders);
        } else {
          console.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getOrders();
  }, [currRestaurant]);

  return (
    <div className="orders-container">
      <h2>Order Page</h2>
      {orders.length > 0 ? orderElements : <p>No orders available</p>}
    </div>
  );
}
