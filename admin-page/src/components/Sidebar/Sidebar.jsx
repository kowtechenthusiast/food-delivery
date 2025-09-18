import { useContext, useState } from "react";
import "./sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { StoredContext } from "../../context";
import { toast } from "react-toastify";

export default function Sidebar() {
  const { setCurrent } = useContext(StoredContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`sidebar ${isExpanded ? "expanded" : ""}`}>
      {/* Hamburger Icon */}
      {!isExpanded ? (
        <div className="hamb" onClick={toggleSidebar}>
          &#9776;
        </div>
      ) : (
        <div className="cross" onClick={toggleSidebar}>
          X
        </div>
      )}

      {/* Sidebar Options */}
      <NavLink
        to="/add-item"
        className={({ isActive }) =>
          isActive ? "side-option active" : "side-option"
        }
      >
        <img src={assets.add_icon} alt="Add Items" />
        <p>Add Items</p>
      </NavLink>

      <NavLink
        to="/food-list"
        className={({ isActive }) =>
          isActive ? "side-option active" : "side-option"
        }
      >
        <img src="menu.png" alt="Food List" />
        <p>Food List</p>
      </NavLink>

      <NavLink
        to="/orders"
        className={({ isActive }) =>
          isActive ? "side-option active" : "side-option"
        }
      >
        <img src={assets.order_icon} alt="Orders" />
        <p>Orders</p>
      </NavLink>

      <div
        className="side-option logout"
        onClick={() => {
          sessionStorage.clear();
          navigate("/");
          setCurrent();
          toast.success("You have logged out successfully");
        }}
      >
        <img src="logout.png" width="24px" alt="" />
        <p>Close</p>
      </div>
    </div>
  );
}
