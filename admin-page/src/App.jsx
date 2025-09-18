import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home/Home";
import AddItem from "./pages/AddItem/AddItem";
import FoodList from "./pages/FoodList/FoodList";
import Orders from "./pages/Orders/Orders";
import AddRestaurant from "./pages/AddRestaurant/AddRestaurant";
import { StoredContext } from "./context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const { currRestaurant } = useContext(StoredContext);
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <div className="layout">
        {currRestaurant && <Sidebar />}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-restaurant" element={<AddRestaurant />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/food-list" element={<FoodList />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
