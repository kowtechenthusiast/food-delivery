import { useContext, useEffect } from "react";
import "./placeorder.css";
import { loadStripe } from "@stripe/stripe-js";
import { StoredContext } from "../../context";
import { useState } from "react";
import AddLocation from "../../components/Map/AddLocation";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_STRIPE_PRIVATE_KEY = import.meta.env.VITE_STRIPE_PRIVATE_KEY;

export default function Placeorder() {
  const {
    getTotalAmount,
    cartItem,
    user,
    delivery_charge,
  } = useContext(StoredContext);
  const stripePromise = loadStripe(VITE_STRIPE_PRIVATE_KEY);
  const [isLoading, setIsLoading] = useState(false);
  const [showCustom, setShow] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationName, setLocationName] = useState(null);
  const [storedAddress, setStoredAddress] = useState(user.address);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const orderResponse = await fetch(`${VITE_API_BASE_URL}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: deliveryData,
        cartItem: cartItem,
        price: getTotalAmount(),
      }),
    });

    const data = await orderResponse.json();

    const order_id = data["order_id"];

    const response = await fetch(
      `${VITE_API_BASE_URL}/create-checkout-session`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItem,
          order_id: order_id,
          delivery_charge: delivery_charge,
        }),
        credentials: "include",
      }
    );
    console.log(cartItem, order_id, delivery_charge);

    const session = await response.json();
    console.log("Session data:", session);

    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      console.error("Error redirecting to Checkout:", error);
    }
  };

  const [address, setAddress] = useState({
    street: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
  });

  const handleAddressChange = (e) => {
    setLocationName(null);
    setStoredAddress(", , ,  - ");
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const [phno, setPhno] = useState(user.phone_no);
  const [deliveryData, setaData] = useState({});

  useEffect(() => {
    // if (user.address != ", , ,  - ")
    //   setaData((prevData) => ({ ...prevData, address: user.address }));
    if (locationName) {
      setaData({
        name: user.name,
        email: user.email,
        address: locationName,
        phone: phno,
      });
    } else if (storedAddress != ", , ,  - ") {
      setaData({
        name: user.name,
        email: user.email,
        address: storedAddress,
        phone: phno,
      });
    } else {
      setaData({
        name: user.name,
        email: user.email,
        address: `${address.street}, ${address.city}, ${address.district}, ${address.state} - ${address.pincode}`,
        phone: phno,
      });
    }
  }, [
    address,
    phno,
    user.name,
    user.email,
    storedAddress,
    user.phone_no,
    locationName,
  ]);

  const handleLocationSelect = (location) => {
    const fetchLocationName = async (lng, lat) => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=pk.eyJ1IjoiY2FwdGFpbi1raW5nIiwiYSI6ImNtNGU2eTc1azBzNzgya3M4NTVhZjRxNmIifQ.QRJL0zl8GiOg0yOx4qGcCA`
        );
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          setLocationName(data.features[0].place_name); // Extract the location name
        }
      } catch (error) {
        console.error("Error fetching location name:", error);
      }
    };
    fetchLocationName(location.lng, location.lat);
  };

  return (
    <form className="placeorder" onSubmit={(e) => handleCheckout(e)}>
      {/* Delivery Information Section */}
      <div className="delivery-info">
        <h1>Delivery Information</h1>

        {!showCustom ? (
          <div className="stored-address">
            <p>
              <strong>Name: </strong>
              {user.name}
            </p>
            <p>
              <strong>Email: </strong>
              {user.email}
            </p>
            <p>
              <strong>Address: </strong>
              {deliveryData.address == ", , ,  - "
                ? "No address available"
                : deliveryData.address}
            </p>
            <p>
              <strong>Phone no: </strong>
              {user.phone_no ? (
                user.phone_no
              ) : (
                <p id="phone-input">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={phno}
                    onChange={(e) => setPhno(e.target.value)}
                  />
                </p>
              )}
            </p>
            {!locationName && (
              <div
                className="edit-address"
                onClick={() => setShow((prev) => !prev)}
              >
                Add custom Address
              </div>
            )}
          </div>
        ) : (
          <div className="custom-address">
            <p>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={user.name}
                readOnly
              />
            </p>
            <p>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={user.email}
                readOnly
              />
            </p>
            <p>
              <input
                type="text"
                name="street"
                placeholder="H.no/Street/Landmark"
                onChange={handleAddressChange}
                value={address.street}
              />
            </p>
            <p className="order-multifield">
              <input
                type="text"
                name="city"
                placeholder="City"
                onChange={handleAddressChange}
                value={address.city}
              />
              <input
                type="text"
                name="district"
                placeholder="District"
                onChange={handleAddressChange}
                value={address.district}
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                onChange={handleAddressChange}
                value={address.state}
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                onChange={handleAddressChange}
                value={address.pincode}
              />
            </p>

            <div
              className="edit-address"
              onClick={() => setShow((prev) => !prev)}
            >
              Back
            </div>
          </div>
        )}
        <div
          className="map-navigate"
          onClick={() => setShowLocationPicker(true)}
        >
          <img src="location.png" alt="" width="30px" />
          <div className="use-location"> Use location </div>
        </div>
        {showLocationPicker && (
          <div className="checkout-location-picker">
            <AddLocation onLocationChange={handleLocationSelect} />
            <div>
              <strong>Selected Location: </strong>
              {locationName ? locationName : "No location selected"}
            </div>
            <div className="checkout-map-bottom">
              <button
                className="checkout-map-button-update"
                onClick={() => setShowLocationPicker(false)}
              >
                update
              </button>
              {/* <div type='submit' className='map-button-update'>update</div> */}
            </div>
          </div>
        )}
      </div>

      {/* Cart Total Section */}
      <div className="cart-total">
        <h2>Cart Totals</h2>
        <div className="cart-details">
          <p>Subtotal</p>
          <p>${getTotalAmount()}</p>
        </div>
        <hr />
        <div className="cart-details">
          <p>Delivery Fee</p>
          <p>${delivery_charge}</p>
        </div>
        <hr />
        <div className="cart-details">
          <p>Total</p>
          <p>${getTotalAmount() + delivery_charge}</p>
        </div>
        <button type="submit" className="cart-proceed" disabled={isLoading}>
          {isLoading ? "Loading..." : "PROCEED TO CHECKOUT"}
        </button>
      </div>
    </form>
  );
}
