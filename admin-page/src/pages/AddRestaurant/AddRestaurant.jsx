import { useState } from "react";
import { assets } from "../../assets/assets";
import "./addRestaurant.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AddRestaurant() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    category: "",
    deliveryCharge: 0,
    openTime: "",
    closeTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurantData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", restaurantData.name);
    formData.append("category", restaurantData.category);
    formData.append("deliveryCharge", restaurantData.deliveryCharge);
    formData.append("openTime", restaurantData.openTime);
    formData.append("closeTime", restaurantData.closeTime);

    await fetch(`${VITE_API_BASE_URL}/restaurant-list`, {
      method: "POST",
      body: formData,
    });

    navigate("/");
    toast.success("New restaurant added successfully!");
  };

  return (
    <div className="add-restaurant-container">
      <form onSubmit={handleSubmit}>
        {/* Image Upload */}
        <div className="image-upload">
          <p>Upload Image</p>
          <label htmlFor="image-upload">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Upload Area"
            />
          </label>
          <input
            type="file"
            id="image-upload"
            name="image"
            required
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* Restaurant Name */}
        <div className="restaurant-name">
          <p>Restaurant Name</p>
          <input
            type="text"
            placeholder="Type here"
            name="name"
            required
            onChange={handleChange}
          />
        </div>

        {/* Category (Veg/Non-Veg) */}
        <div className="category">
          <p>Restaurant Category</p>
          <input
            list="category"
            name="category"
            required
            onChange={handleChange}
          />
          <datalist id="category">
            <option value="veg"></option>
            <option value="non-veg"></option>
          </datalist>
        </div>

        {/* Delivery Charge */}
        <div className="delivery-charge">
          <p>Delivery Charge (₹)</p>
          <input
            type="number"
            name="deliveryCharge"
            min="0"
            required
            onChange={handleChange}
          />
        </div>

        {/* Open and Close Time */}
        <div className="time">
          <div className="open-time">
            <p>Open Time</p>
            <input
              type="time"
              name="openTime"
              required
              onChange={handleChange}
            />
          </div>
          <div className="close-time">
            <p>Close Time</p>
            <input
              type="time"
              name="closeTime"
              required
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Submit and Reset Buttons */}
        <div className="buttons">
          <button type="submit">ADD</button>
          <button type="reset" onClick={() => setImage(null)}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
