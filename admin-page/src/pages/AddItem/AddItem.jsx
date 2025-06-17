import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import "./additem.css";
import { StoredContext } from "../../context";
import { toast } from "react-toastify";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AddItem() {
  const { currRestaurant } = useContext(StoredContext);
  const [image, setImage] = useState(false);
  const [foodData, setFoodData] = useState({
    name: "",
    price: 0,
    description: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFoodData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", foodData.name);
    formData.append("restaurant_name", currRestaurant);
    formData.append("price", foodData.price);
    formData.append("description", foodData.description);
    formData.append("category", foodData.category);

    const response = await fetch(`${VITE_API_BASE_URL}/food-list`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (response.ok) {
      toast.success(data.message);
    } else {
      toast.error("Problem occured during add item!");
    }
  };
  return (
    <div>
      <form className="add-item" onSubmit={handleSubmit}>
        <div className="image-upload">
          <p>Upload Image</p>
          <label htmlFor="image-upload">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
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
        <div className="product-name">
          <p>Product Name</p>
          <input
            type="text"
            placeholder="Type here"
            name="name"
            required
            onChange={handleChange}
          />
        </div>
        <div className="product-description">
          <p>Product description</p>
          <textarea
            placeholder="Write content here"
            name="description"
            required
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="multifield">
          <div className="category">
            <p>Product Category</p>
            <input
              list="category"
              name="category"
              required
              onChange={handleChange}
            />
            <datalist id="category">
              <option value="Salad"></option>
              <option value="Noodles"></option>
              <option value="Sandwich"></option>
              <option value="Deserts"></option>
              <option value="Rolls"></option>
              <option value="Cake"></option>
              <option value="Pure Veg"></option>
              <option value="Pasta"></option>
            </datalist>
          </div>
          <div className="price">
            <p>Product price</p>
            <div className="price-input">
              {foodData.price > 0 && <span className="dollar-symbol">₹</span>}
              <input
                type="number"
                name="price"
                min="1"
                required
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <button className="button-additem" type="submit">
          ADD
        </button>
        <button
          className="button-additem"
          type="reset"
          onClick={() => setImage(false)}
        >
          Reset
        </button>
      </form>
    </div>
  );
}
