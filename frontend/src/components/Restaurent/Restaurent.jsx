import React, { useEffect, useState, useContext } from "react";
import "./restaurent.css";
import { Link, useLocation } from "react-router-dom";
import { StoredContext } from "../../context";
import Loading from "../Loading/Loading";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Restaurent() {
  const { setCurrRest, setList, setMenuList, setLoading, setActive } =
    useContext(StoredContext);

  const [restaurantData, setRestaurantData] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.state]);

  useEffect(() => {
    async function getData() {
      const response = await fetch(`${VITE_API_BASE_URL}/restaurant-list`, {
        method: "GET",
      });

      const data = await response.json();
      setRestaurantData(data.restaurant_list);
      setIsLoading(false);
    }
    async function getFilteredData() {
      const response = await fetch(`${VITE_API_BASE_URL}/filter-rest-list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filter),
      });
      const data = await response.json();
      setRestaurantData(data.restaurant_list);
    }
    if (filter === "All") getData();
    else getFilteredData();
  }, [filter]);

  function setRestaurentStatus(openTime, closeTime) {
    const currentTime = new Date();
    const currentMinute =
      currentTime.getHours() * 60 + currentTime.getMinutes();

    return currentMinute >= openTime && currentMinute <= closeTime;
  }

  const restList = restaurantData.map((item, index) => {
    const isOpen = setRestaurentStatus(item.open_time, item.close_time);

    return (
      <Link
        to={`/restaurant-menu/${item.id}`}
        state={{ open: item.open_time, close: item.close_time }}
        key={index}
      >
        <div
          className="restaurant-card"
          onClick={() => {
            setList([]);
            setMenuList([]);
            setCurrRest(item.name);
            window.scrollTo(0, 0);
            setLoading(true);
            setActive("restaurant");
          }}
        >
          <img
            src={`data:image/png;base64,${item.image}`}
            alt="image"
            className="restaurant-image"
          />
          <div className="restaurant-info">
            <h2 className="restaurant-name">{item.name}</h2>
            <div className="info-bottom">
              <div className="restaurant-type">
                <img
                  src={item.category == "veg" ? "green.png" : "red.png"}
                  alt=""
                />
                <span>{item.category == "veg" ? "Veg" : "Non-veg"}</span>
              </div>
              <p className="delivery-charge">
                Delivery Charge: ${item.delivery_charge}
              </p>
            </div>
          </div>
          <div>
            <p className={`restaurant-status ${isOpen ? "open" : "closed"}`}>
              {isOpen ? "Open" : "Closed"}
            </p>
          </div>
        </div>
      </Link>
    );
  });
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="restaurant-page">
      <h2 className="restaurant-title" id="restaurant">
        Explore Our Resataurant
      </h2>
      <p className="restaurant-disc">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Amet ratione
        dolore, harum iste excepturi pariatur praesentium assumenda possimus
        nemo unde dolor, natus iusto magni ex ipsum molestias eaque animi vitae?
      </p>
      <div>
        <select
          name="filter"
          id=""
          className="restaurant-filter"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">--Filter--</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-veg</option>
        </select>
      </div>
      {restList}
    </div>
  );
}

export default Restaurent;
