import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
        const response = await fetch(`${VITE_API_BASE_URL}/get-food-list`, {
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
        const response = await fetch(`${VITE_API_BASE_URL}/food-list`, {
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
      const response = await fetch(`${VITE_API_BASE_URL}/restaurant-list`, {
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
      const response = await fetch(`${VITE_API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        setAuthentication(false);
        toast.success("You have logged out successfully!");
        window.location.reload();
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
