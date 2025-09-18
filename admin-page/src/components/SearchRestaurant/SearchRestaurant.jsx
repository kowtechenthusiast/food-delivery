import { useContext, useState } from "react";
import "./searchrestaurant.css";
import { StoredContext } from "../../context";
import { toast } from "react-toastify";

const SearchRestaurant = () => {
  const { restaurantNames, setCurrent } =
    useContext(StoredContext);
  const [query, setQuery] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Filter restaurants based on query
    setFilteredRestaurants(
      restaurantNames.filter((restaurant) =>
        restaurant.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSelectRestaurant = (restaurant) => {
    setQuery(restaurant); // Set the input value to the selected restaurant
    setFilteredRestaurants([]); // Close the dropdown
  };

  return (
    <div className="full-page-container">
      <div className="search-box">
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
          if(restaurantNames.includes(query)){
            setCurrent(query);
            setQuery("");
            toast.info(`${query} is Active now`);
          } else{
            setQuery("");
            toast.error(`${query} is not found`);
          }
        }}
      >
        &#8981;
      </div>
    </div>
  );
};

export default SearchRestaurant;
