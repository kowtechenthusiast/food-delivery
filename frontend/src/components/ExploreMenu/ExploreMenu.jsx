/* eslint-disable react/prop-types */
import { useContext } from "react";
import "./explore.css";
// import { menu_list } from "../../assets/assets";
import { StoredContext } from "../../context";

function ExploreMenu({ category, setCategory }) {
  const { menu_list } = useContext(StoredContext);

  const menuItem = menu_list.map((item, index) => {
    return (
      <div
        onClick={() =>
          setCategory((prev) =>
            prev === item.category ? "All" : item.category
          )
        }
        className={`menu-selector ${
          category === item.category ? "active-menu" : ""
        }`}
        key={index}
      >
        <div className="menu-image">
          <img src={`data:image/png;base64,${item.image}`} alt="" />
        </div>
        <p className="menu-name">{item.category}</p>
      </div>
    );
  });
  return (
    <div className="explore-menu" id="menu">
      <p className="menu-title">Explore our Menu</p>
      <p className="menu-disc">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat vero
        amet explicabo voluptatum repellat fuga tempore nobis eligendi labore
        illo quia dicta modi, hic temporibus nesciunt! Est corrupti quaerat sed.
      </p>
      <div className="menu-container">{menuItem}</div>
    </div>
  );
}

export default ExploreMenu;
