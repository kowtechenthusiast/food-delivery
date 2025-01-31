import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const StoredContext = createContext(null);

const ContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [all_food_list, setAllList] = useState([]);
  const [food_list, setList] = useState([]);
  const [menu_list, setMenuList] = useState([]);
  const [curr_rest, setCurrRest] = useState();
  const [isListLoading, setLoading] = useState(true);
  const [delivery_charge, setDelivery_charge] = useState(0);
  const [restList, setRestList] = useState([]);
  const [allRest, setAllRest] = useState([]);
  const [isActive, setActive] = useState("home");

  useEffect(() => {
    async function getList() {
      try {
        const response = await fetch("/api/get-food-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(curr_rest),
        });
        const data = await response.json();
        setList(data.food_list);
        setMenuList(data.menu_list);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch food list:", error);
      }
    }
    if (curr_rest) getList();
  }, [curr_rest]);

  useEffect(() => {
    async function getAllFoodList() {
      try {
        const response = await fetch("/api/food-list", {
          method: "GET",
        });
        const data = await response.json();
        setAllList(data.food_list);
      } catch (error) {
        console.error("Failed to fetch food list:", error);
      }
    }
    getAllFoodList();
  }, []);

  useEffect(() => {
    async function getList() {
      const response = await fetch("/api/restaurant-list", {
        method: "GET",
      });
      const data = await response.json();
      setRestList(data.restaurant_names);
      setAllRest(data.restaurant_list);
    }
    getList();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // Ensures cookies (session) are sent with the request
      });

      if (response.ok) {
        setUser(null); // Clear the user data from state
        setAuthentication(false);
        toast.success("You have logged out successfully!");
      }
    } catch (error) {
      console.error("Error during logout", error);
      toast.error("Error during logout");
    }
  };

  const [userState, setUserState] = useState("newuser");
  const [isAuthenticated, setAuthentication] = useState(false);

  const [cartItem, setCartItem] = useState({});

  function addToCart(itemId) {
    if (!cartItem[itemId]) {
      setCartItem((prev) => ({ ...prev, [itemId]: 1 }));
    } else setCartItem((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  }

  function removeFromCart(itemId) {
    setCartItem((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  }

  function getTotalAmount() {
    let totalAmount = 0;
    for (let item in cartItem) {
      let itemInfo = all_food_list.find((obj) => obj._id == item);
      totalAmount += cartItem[item] * itemInfo.price;
    }
    return totalAmount;
  }

  getTotalAmount();

  const contextValue = {
    user,
    setUser,
    restList,
    allRest,
    isActive,
    setActive,
    logout,
    cartItem,
    menu_list,
    food_list,
    all_food_list,
    setList,
    setLoading,
    isListLoading,
    setMenuList,
    setCurrRest,
    setCartItem,
    addToCart,
    removeFromCart,
    getTotalAmount,
    userState,
    setUserState,
    isAuthenticated,
    setAuthentication,
    setDelivery_charge,
    delivery_charge,
  };

  return (
    <StoredContext.Provider value={contextValue}>
      {props.children}
    </StoredContext.Provider>
  );
};

export default ContextProvider;
