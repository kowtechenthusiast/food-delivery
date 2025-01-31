import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Cart from "./pages/Cart/Cart";
import Placeorder from "./pages/PlaceOrder/Placeorder";
import Signup from "./components/SignUp/Signup";
import { StoredContext } from "./context";
import Orders from "./pages/Orders/Orders";
import Profile from "./pages/Profile/Profile";
import RestaurantMenu from "./pages/RestaurantMenu/RestaurantMenu";
import Restaurent from "./components/Restaurent/Restaurent";
import Home from "./pages/Home/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/"]; // Add all routes where you don't want the Navbar
  const [showSignUp, setShow] = useState(false);
  const { setUser, setAuthentication, user } = useContext(StoredContext);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/get-user", {
        method: "GET",
        credentials: "include", // Include credentials (cookies)
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        if (userData) setAuthentication(true);
      } else {
        console.log("Error in fetching data");
      }
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <>
      {showSignUp && <Signup setShow={setShow} />}
      <ToastContainer />
      {!hideNavbarRoutes.includes(location.pathname) && (
        <Navbar setShow={setShow} />
      )}
      <Routes>
        <Route path="/" element={<Home setShow={setShow} />} />
        <Route path="/restaurant" element={<Restaurent />} />
        {user && <Route path="/cart" element={<Cart />} />}
        {user && <Route path="/my-order" element={<Orders />} />}
        {user && <Route path="/profile" element={<Profile />} />}
        {user && <Route path="/order" element={<Placeorder />} />}
        <Route path="/restaurant-menu/:id/" element={<RestaurantMenu />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
