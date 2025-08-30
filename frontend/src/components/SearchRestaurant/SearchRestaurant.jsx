import { useContext, useState } from "react";
import "./searchRest.css";
import { StoredContext } from "../../context";
import { useNavigate } from "react-router-dom";

const SearchRestaurant = () => {
  const {
    restList,
    allRest,
    setCurrRest,
    setList,
    setMenuList,
    setLoading,
    setActive,
  } = useContext(StoredContext);
  const [query, setQuery] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Filter restaurants based on query
    setFilteredRestaurants(
      restList.filter((restaurant) =>
        restaurant.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSelectRestaurant = (restaurant) => {
    setQuery(restaurant); // Set the input value to the selected restaurant
    setFilteredRestaurants([]); // Close the dropdown
    const rest = allRest.find((item) => item.name === restaurant);
    setRestaurant(rest);
  };
  const navigate = useNavigate();

  return (
    <div className="search-box">
      <div className="input-field">
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          className="search-input"
          placeholder="Search for a restaurant..."
        />
        {query && (
          <div className="custom-datalist">
            <ul>
              {filteredRestaurants.map((restaurant, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectRestaurant(restaurant)}
                >
                  {restaurant}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div
        className="search-submit"
        onClick={() => {
          setQuery("");
          navigate(`/restaurant-menu/${restaurant.id}`, {
            state: { open: restaurant.open_time, close: restaurant.close_time },
          });
          setList([]);
          setMenuList([]);
          setCurrRest(restaurant.name);
          window.scrollTo(0, 0);
          setLoading(true);
          setActive("restaurant");
        }}
      >
        &#8981;
      </div>
    </div>
  );
};

export default SearchRestaurant;
