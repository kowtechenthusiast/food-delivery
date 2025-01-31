import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { assets } from "../../assets/assets";
import { StoredContext } from "../../context";
import { toast } from "react-toastify";
const Navbar = ({ setShow }) => {
  const {
    getTotalAmount,
    isAuthenticated,
    user,
    logout,
    cartItem,
    setActive,
    isActive,
  } = useContext(StoredContext);
  const [isExpand, setExpand] = useState(false);
  toast;
  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.nav_logo} alt="logo" className="navbar-logo" />
      </Link>
      <ul className="navigators">
        <Link to="/">
          <li
            className={isActive == "home" ? "active" : ""}
            onClick={() => setActive("home")}
          >
            home
          </li>
        </Link>
        <Link to="/restaurant" onClick={() => setActive("restaurant")}>
          <li className={isActive === "restaurant" ? "active" : ""}>
            restaurant
          </li>
        </Link>
        <Link
          to="/"
          state={{ scrollTo: "mobile" }} // Pass state to indicate where to scroll
          onClick={() => setActive("mobile")}
        >
          <li className={isActive === "mobile" ? "active" : ""}>mobile</li>
        </Link>

        <Link
          to="#contact"
          state={{ scrollTo: "contact" }}
          onClick={() => setActive("contact")}
        >
          <li className={isActive == "contact" ? "active" : ""}>contact us</li>
        </Link>
      </ul>
      <div className="navbar-right">
        {/* <img src={assets.search_icon} alt="" className="navbar-search" /> */}
        {user && (
          <div className="navbar-cart">
            <Link to="/cart">
              <img src={assets.basket_icon} alt="" className="cart-icon" />
            </Link>
            {getTotalAmount() != 0 && (
              <div className="cart-dot">{Object.keys(cartItem).length}</div>
            )}
          </div>
        )}
        {!isAuthenticated && (
          <button className="signup" onClick={() => setShow(true)}>
            signup
          </button>
        )}
        {isAuthenticated && (
          <div onMouseEnter={() => setExpand(true)}>
            <button className="profile">
              <img src={assets.profile_icon}></img>
            </button>
            {isExpand && (
              <div
                className="profile-div"
                onMouseLeave={() => setExpand(false)}
              >
                <Link to="/profile">
                  <h3>{user.name}</h3>
                  <p>Manage Account</p>
                </Link>
                <Link to="/my-order">
                  <div className="profile-nav">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1.5em"
                      viewBox="0 0 384 512"
                    >
                      <path d="M32 32C32 14.3 46.3 0 64 0L320 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-29.5 0 11.4 148.2c36.7 19.9 65.7 53.2 79.5 94.7l1 3c3.3 9.8 1.6 20.5-4.4 28.8s-15.7 13.3-26 13.3L32 352c-10.3 0-19.9-4.9-26-13.3s-7.7-19.1-4.4-28.8l1-3c13.8-41.5 42.8-74.8 79.5-94.7L93.5 64 64 64C46.3 64 32 49.7 32 32zM160 384l64 0 0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96z" />
                    </svg>
                    <button>Orders</button>
                  </div>
                </Link>
                <hr />

                <div className="profile-nav">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1.5em"
                    viewBox="0 0 512 512"
                  >
                    <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
                  </svg>
                  <button
                    onClick={() => {
                      logout();
                      setExpand(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// function ProfileExpand({setExpand}) {
//   const {logout,user} = useContext(StoredContext);
//   return (
//   )
// }

export default Navbar;
