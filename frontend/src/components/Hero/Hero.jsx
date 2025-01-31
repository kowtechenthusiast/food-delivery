import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./hero.css";
import { StoredContext } from "../../context";
import { assets } from "../../assets/assets";
import SearchRestaurant from "../SearchRestaurant/SearchRestaurant";
const Hero = ({ setShow }) => {
  const { getTotalAmount, isAuthenticated, user, logout, cartItem, setActive } =
    useContext(StoredContext);
  const [isExpand, setExpand] = useState(false);
  const [city, setCity] = useState("");

  const accessToken =
    "pk.eyJ1IjoiY2FwdGFpbi1raW5nIiwiYSI6ImNtNGU2eTc1azBzNzgya3M4NTVhZjRxNmIifQ.QRJL0zl8GiOg0yOx4qGcCA"; // Replace with your Mapbox API token

  const getCityFromCoordinates = async (latitude, longitude) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch city data");
      }
      const data = await response.json();

      // Extract city from response
      const place = data.features.find((feature) =>
        feature.place_type.includes("place")
      );
      return place ? place.text : "your city";
    } catch (error) {
      console.error("Error fetching city:", error);
      return "Error fetching city";
    }
  };

  const fetchCurrentCity = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const fetchedCity = await getCityFromCoordinates(latitude, longitude);
          setCity(fetchedCity);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setCity("here");
        }
      );
    } else {
      setCity("here");
    }
  };

  useEffect(() => {
    fetchCurrentCity();
  }, []);
  return (
    <div className="hero">
      <nav className="hero-navbar">
        <img src="hero-logo.png" alt="" />
        <div className="hero-nav-right">
          {/* <div className='rest-add'>Add Restaurant</div> */}
          <Link to="/restaurant">
            <div className="rest-page" onClick={() => setActive("restaurant")}>
              Restaurants
            </div>
          </Link>

          {user && (
            <div className="navbar-cart">
              <Link to="/cart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  width="45px"
                >
                  <path
                    fill="#ffffff"
                    d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"
                  />
                </svg>
              </Link>
              {getTotalAmount() != 0 && (
                <div className="home-cart-dot">
                  {Object.keys(cartItem).length}
                </div>
              )}
            </div>
          )}
          {!isAuthenticated && (
            <button onClick={() => setShow(true)}>signup</button>
          )}
          {isAuthenticated && (
            <div onMouseEnter={() => setExpand(true)} className="hero-profile">
              <Link to="/profile">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  width="30px"
                >
                  <path
                    fill="#ffffff"
                    d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z"
                  />
                </svg>
              </Link>
              {isExpand && (
                <div
                  onMouseLeave={() => setExpand(false)}
                  className="hero-profile-block"
                >
                  <Link to="/my-order">
                    <div className="hero-profile-nav">
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

                  <div className="hero-profile-nav">
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
      </nav>
      <div className="hero-text">
        <h1 className="company-name">Swift Go</h1>
        <h2 className="hero-title">
          Discover the best food & restaurant in {city}
        </h2>
        <form className="hero-search">
          {/* <input type="text" name="" id="" placeholder='Search restaurant here...'/>
              <button type="submit">&#8981;</button> */}
          <SearchRestaurant />
        </form>
        {/* <p>An intuitive food delivery platform offering a seamless experience to explore, filter, and order your favorite dishes. Features include personalized recommendations, category-based filtering, and an admin panel for efficient food management.</p> */}
        {/* <button><a href="#restaurant">View Restaurant</a></button> */}
      </div>
    </div>
  );
};

export default Hero;
