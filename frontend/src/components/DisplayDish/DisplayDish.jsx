/* eslint-disable react/prop-types */
import { useContext } from "react";
import "./display.css";
import FoodItem from "../FoodItem/FoodItem";
import { StoredContext } from "../../context";
import { useLocation } from "react-router-dom";

const DisplayDish = ({ category }) => {
  const location = useLocation();
  const { state } = location;
  const { food_list } = useContext(StoredContext);
  function setRestaurentStatus(openTime, closeTime) {
    const currentTime = new Date();
    const currentMinute =
      currentTime.getHours() * 60 + currentTime.getMinutes();

    return currentMinute >= openTime && currentMinute <= closeTime;
  }

  const isOpen = setRestaurentStatus(state.open, state.close);

  const dishes = food_list.map((item, index) => {
    if (category === "All" || item.category === category) {
      return <FoodItem key={index} item={item} isOpen={isOpen} />;
    }
  });

  return <div className="foodDisplay">{dishes}</div>;
};

export default DisplayDish;
