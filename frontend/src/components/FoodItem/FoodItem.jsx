import React, { useContext } from "react";
import "./foodItem.css";
import { assets } from "../../assets/assets";
import { StoredContext } from "../../context";

export default function FoodItem({ item, isOpen }) {
  const { cartItem, addToCart, removeFromCart, isAuthenticated } =
    useContext(StoredContext);

  return (
    <div className="dish-container">
      <div className="dish-display">
        <img
          src={`data:image/png;base64,${item.image}`}
          alt=""
          className="dish-image"
        />

        {isAuthenticated &&
          isOpen &&
          (!cartItem[item._id] ? (
            <img
              src={assets.add_icon_white}
              alt=""
              className="add"
              onClick={() => addToCart(item._id)}
            />
          ) : (
            <div className="dish-counter">
              <img
                src={assets.remove_icon_red}
                alt=""
                onClick={() => removeFromCart(item._id)}
              />
              <div>{cartItem[item._id]}</div>
              <img
                src={assets.add_icon_green}
                alt=""
                onClick={() => addToCart(item._id)}
              />
            </div>
          ))}
      </div>

      <div className="dish-details">
        <div className="dish-name">{item.name}</div>
        <img src={assets.rating_starts} alt="" className="rating" />
        <div className="dish-disc">{item.description}</div>
        <div className="dish-price">${item.price}</div>
      </div>
    </div>
  );
}
