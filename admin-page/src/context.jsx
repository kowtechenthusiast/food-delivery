import { createContext, useState, useEffect } from "react";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const StoredContext = createContext(null);

const ContextProvider = (props) => {
  const [restaurantList, setList] = useState([]);
  const [restaurantNames, setNameList] = useState([]);
  const [currRestaurant, setCurrent] = useState(() => {
    // Get the current restaurant from sessionStorage if available
    return sessionStorage.getItem("currRestaurant") || "";
  });
  useEffect(() => {
    async function getList() {
      const response = await fetch(`${VITE_API_BASE_URL}/restaurant-list`, {
        method: "GET",
      });
      const data = await response.json();
      setList(data.restaurant_list);
      console.log("*********************************", restaurantList);

      setNameList(data.restaurant_names);
    }
    getList();
  }, []);

  useEffect(() => {
    // Store currRestaurant in sessionStorage whenever it changes
    if (currRestaurant) {
      sessionStorage.setItem("currRestaurant", currRestaurant);
    }
  }, [currRestaurant]);

  const contextValue = {
    restaurantList,
    currRestaurant,
    setCurrent,
    restaurantNames,
    setNameList,
  };

  return (
    <StoredContext.Provider value={contextValue}>
      {props.children}
    </StoredContext.Provider>
  );
};

export default ContextProvider;
