import { React, useState, useEffect, useContext } from "react";
import "./restaurantMenu.css";
import DisplayDish from "../../components/DisplayDish/DisplayDish";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import { StoredContext } from "../../context";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading/Loading";

function RestaurantMenu() {
  const [category, setCategory] = useState("All");
  const { isListLoading, restList, curr_rest } = useContext(StoredContext);
  const { id } = useParams();

  if (isListLoading) return <Loading />;
  else
    return (
      <div className="rest-menu-page">
        <div id="menu-pape-title">{restList[id - 1]}</div>
        <ExploreMenu category={category} setCategory={setCategory} />
        <DisplayDish category={category} />
      </div>
    );
}

export default RestaurantMenu;
