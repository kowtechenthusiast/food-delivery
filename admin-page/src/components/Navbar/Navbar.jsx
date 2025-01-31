import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { StoredContext } from "../../context";

export default function Navbar() {
  const [isHovered, setHoverStatus] = useState(false);
  const { currRestaurant } = useContext(StoredContext);
  return (
    <div className="navbar">
      <Link to="/">
        <img src="download__7_-removebg-preview.png" alt="Logo" width="120px" />
      </Link>

      {currRestaurant ? (
        <h4 className="restaurant-name">{currRestaurant}</h4>
      ) : (
        <Link to="/add-restaurant">
          <div
            onMouseEnter={() => setHoverStatus(true)}
            onMouseLeave={() => setHoverStatus(false)}
            className="hover-container"
          >
            {isHovered ? (
              <button className="add-rest">Add Restaurant</button>
            ) : (
              <img
                src="restaurant-icon.png"
                alt="Add Restaurant"
                className="rest-icon"
              />
            )}
          </div>
        </Link>
      )}
    </div>
  );
}
