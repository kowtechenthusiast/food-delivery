import { assets } from "../../assets/assets";
import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import { StoredContext } from "../../context";
import AddLocation from "../../components/Map/AddLocation";
import { toast } from "react-toastify";

const Profile = () => {
  const { user } = useContext(StoredContext);

  const [preview, setPreview] = useState(assets.upload_area);
  const [isUpdate, setUpdate] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const [phno, setPhno] = useState(user.phone_no || "");
  const [image, setImage] = useState(user.image || null);
  const [locationName, setLocationName] = useState("No location selected yet.");

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
      setLocationName("Failed to fetch location name.");
    }
  };

  const dataURLtoFile = (dataUrl, filename) => {
    let arr = dataUrl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const [address, setAddress] = useState({
    street: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
  });

  const [userData, setUserData] = useState({
    email: user.email || "",
    location: null,
  });

  // Synchronize the address and user data
  useEffect(() => {
    setUserData((prevData) => ({
      ...prevData,
      address: `${address.street}, ${address.city}, ${address.district}, ${address.state} - ${address.pincode}`,
    }));
  }, [address]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(assets.upload_area);
  };

  const handleLocationSelect = (location) => {
    fetchLocationName(location.lng, location.lat);
    setUserData((prevData) => ({
      ...prevData,
      address: locationName,
    }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      let processedImage = image; // Use a new variable

      if (processedImage) {
        if (typeof processedImage === "string") {
          if (!processedImage.startsWith("data:image")) {
            processedImage = `data:image/jpeg;base64,${processedImage}`;
          }
          const file = dataURLtoFile(processedImage, "profile.jpg");
          formData.append("image", file);
        } else {
          formData.append("image", processedImage); // If it's already a File object
        }
      }
      formData.append("email", userData.email);
      formData.append("phone_no", phno);
      formData.append("address", userData.address);
      if (userData.location) {
        formData.append("location", JSON.stringify(userData.location));
      }

      const response = await fetch("/api/update-user", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
        setTimeout(() => {
          window.location.reload(); // Reload the page after a delay
        }, 1500); // 1000ms = 1 second delay
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="profile-container">
      <form className="profile-card">
        <div className="profile-content">
          {/* Image Section */}
          <div className="image-section">
            {image && (
              <div
                type="button"
                className="remove-image-button"
                onClick={handleRemoveImage}
              >
                X
              </div>
            )}
            <label htmlFor="file-input">
              <img
                src={
                  user.image === image && image !== null
                    ? `data:image/png;base64,${user.image}`
                    : preview
                }
                alt="Profile Preview"
                className="profile-image"
              />
            </label>
            <input
              type="file"
              id="file-input"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </div>

          {/* Personal Info Section */}
          <div className="personal-info-section">
            <h2 className="profile-name">Edit Profile</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={user.name}
              readOnly
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              readOnly
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={phno}
              onChange={(e) => setPhno(e.target.value)}
              required
            />
          </div>
        </div>
        <fieldset className="address-fieldset">
          <legend>Address</legend>
          <div
            className="update-address"
            onClick={() => setUpdate((prev) => !prev)}
          >
            {isUpdate ? "Close" : "Update"}
          </div>

          {/* Address Section */}
          {isUpdate || !user.address ? (
            <>
              <input
                className="address-field"
                type="text"
                name="street"
                placeholder="H.no/Street/Land mark"
                value={address.street}
                onChange={handleAddressChange}
                required
              />
              <div className="address-section">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={address.city}
                  onChange={handleAddressChange}
                  required
                />
                <input
                  type="text"
                  name="district"
                  placeholder="District"
                  value={address.district}
                  onChange={handleAddressChange}
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={address.state}
                  onChange={handleAddressChange}
                  required
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </>
          ) : (
            <textarea
              className="address-section-textarea"
              value={
                userData.address === ", , ,  - "
                  ? user.address
                  : locationName
                  ? locationName
                  : userData.address
              }
              readOnly
            />
          )}
          {!isUpdate && (
            <div
              className="location"
              onClick={() => setShowLocationPicker(true)}
            >
              Use location
            </div>
          )}
        </fieldset>
        {isUpdate && (
          <button className="profile-save" type="button" onClick={handleSubmit}>
            Save
          </button>
        )}

        {/* Location Picker */}
        {showLocationPicker && (
          <div className="profile-location-picker">
            <AddLocation onLocationChange={handleLocationSelect} />
            <div>
              <strong>Selected Location: </strong>
              {locationName}
            </div>
            <div className="profile-map-bottom">
              <div
                className="profile-map-button-update"
                onClick={() => {
                  handleSubmit();
                  setShowLocationPicker(false);
                }}
              >
                submit
              </div>
              {/* <button type='submit' className='profile-map-button-update'>update</button> */}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
