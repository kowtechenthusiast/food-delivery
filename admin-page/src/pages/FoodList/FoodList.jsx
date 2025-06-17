import React, { useContext, useEffect, useState } from "react";
import "./foodlist.css";
import { StoredContext } from "../../context";
import { toast } from "react-toastify";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function FoodList() {
  const [food_list, setList] = useState([]);
  const { currRestaurant } = useContext(StoredContext);

  async function getFoodList() {
    const responses = await fetch(`${VITE_API_BASE_URL}/food-list-admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currRestaurant),
    });

    const data = await responses.json();
    setList(data.food_list);
  }
  useEffect(() => {
    getFoodList();
  }, []);

  async function deleteDish(dishId) {
    const response = await fetch(`${VITE_API_BASE_URL}/delete-dish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dishId }),
    });
    const data = await response.json();
    if (response.ok) {
      toast.warning(`${data.name} removed from the list`);
      getFoodList();
    }
  }

  const dishRow = food_list.map((dish, index) => {
    return (
      <tr key={index} className="food-list__row">
        <td className="food-list__cell food-list__image-cell">
          <img
            src={`data:image/png;base64,${dish.image}`}
            alt={dish.name}
            width={60}
            className="food-list__image"
          />
        </td>
        <td className="food-list__cell">{dish.name}</td>
        <td className="food-list__cell">{dish.category}</td>
        <td className="food-list__cell">{dish.price}</td>
        <td className="food-list__cell">{dish.description}</td>
        <td
          className="food-list__cell delete-action"
          onClick={() => deleteDish(dish._id)}
        >
          <img src="delete.png" alt="" width="20px" />
        </td>
      </tr>
    );
  });
  if (food_list.length > 0)
    return (
      <div className="food-list">
        <table className="food-list__table">
          <thead>
            <tr className="food-list__header-row">
              <th className="food-list__header">Image</th>
              <th className="food-list__header">Name</th>
              <th className="food-list__header">Category</th>
              <th className="food-list__header">Price</th>
              <th className="food-list__header">Description</th>
              <th className="food-list__header">Action</th>
            </tr>
          </thead>
          <tbody>{dishRow}</tbody>
        </table>
      </div>
    );
}
