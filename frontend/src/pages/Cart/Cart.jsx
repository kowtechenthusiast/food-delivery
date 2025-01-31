import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./cart.css";
import { StoredContext } from "../../context";

export default function Cart() {
  const {
    all_food_list,
    cartItem,
    removeFromCart,
    getTotalAmount,
    delivery_charge,
    setDelivery_charge,
  } = useContext(StoredContext);

  useEffect(() => {
    async function fetchShipping() {
      const response = await fetch("/api/calculate-shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItem: cartItem }),
      });
      const data = await response.json();
      setDelivery_charge(data["delivery_charge"]);
    }
    fetchShipping();
  }, [delivery_charge]);

  if (!all_food_list) {
    return <div>Loading...</div>; // Show loading state if the array is not available
  }
  const cart_list = all_food_list.map((item, index) => {
    if (cartItem[item._id] > 0) {
      return (
        <tr key={index} className="cart-row">
          <td className="cart-cell">
            <img
              src={`data:image/png;base64,${item.image}`}
              alt=""
              width="55px"
              className="cart-image"
            />
          </td>
          <td className="cart-cell">
            <p>{item.name}</p>
            <p className="cart-restoName">{item.restaurant_name}</p>
          </td>
          <td className="cart-cell">{cartItem[item._id]}</td>
          <td className="cart-cell">${item.price}</td>
          <td className="cart-cell">{cartItem[item._id] * item.price}</td>
          <td className="cart-cell" onClick={() => removeFromCart(item._id)}>
            X
          </td>
        </tr>
      );
    }
    return null;
  });

  if (getTotalAmount() === 0) {
    return <div className="no-item">Your Cart is Empty...!</div>;
  } else
    return (
      <div className="cart-page">
        <div className="cart-container">
          <hr />
          <table className="cart-table">
            <thead>
              <tr className="cart-header">
                <th className="cart-header-cell">Item</th>
                <th className="cart-header-cell">Title</th>
                <th className="cart-header-cell">Quantity</th>
                <th className="cart-header-cell">Price</th>
                <th className="cart-header-cell">Total</th>
                <th className="cart-header-cell">Remove</th>
              </tr>
            </thead>
            <tbody>{cart_list}</tbody>
          </table>
        </div>
        <div className="cart-bottom">
          <div>
            <div className="cart-total">
              <h2>Cart Totals</h2>
              <div className="cart-details">
                <p>Subtotal</p>
                <p>${getTotalAmount()}</p>
              </div>
              <hr />
              <div className="cart-details">
                <p>Delivery Fee</p>
                <p>${delivery_charge}</p>
              </div>
              <hr />
              <div className="cart-details">
                <p>Total</p>
                <p>${getTotalAmount() + delivery_charge}</p>
              </div>
            </div>
            <Link to="/order">
              <button className="cart-proceed">PROCEED TO CHECKOUT</button>
            </Link>
          </div>
          <div className="cart-bottom-left">
            <p>If you have any promocode, Enter here</p>
            <div className="promo-input">
              <input
                type="text"
                className="promo-code"
                placeholder="Enter Promo code"
              />
              <button type="submit">Submit</button>
            </div>
          </div>
        </div>
      </div>
    );
}
