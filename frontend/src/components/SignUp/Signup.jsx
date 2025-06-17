import React, { useContext, useState } from "react";
import "./signup.css";
import { assets } from "../../assets/assets";
import { StoredContext } from "../../context";
import { toast } from "react-toastify";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Signup({ setShow }) {
  const {
    userState,
    setUserState,
    isAuthenticated,
    setAuthentication,
    setUser,
  } = useContext(StoredContext);
  const [signupData, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleInput(e) {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const fetchUser = async (e) => {
    e.preventDefault();

    const url = userState === "newuser" ? "signup" : "login";
    const response = await fetch(`${VITE_API_BASE_URL}/${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupData),
    });

    const result = await response.json(); // Uncomment to get response

    if (response.ok) {
      if (userState === "newuser") {
        setUserState("registered");
        toast.success("Account created successfully!");
      } else {
        toast.success(`Welcome back ${signupData.name}`);
        setUser(result.name);
        setAuthentication(true);
        setShow(false);
      }
    } else {
      toast.warning("Invalid email or password");
    }
  };

  return (
    <div className="popup-container">
      <form className="signup-form" onSubmit={fetchUser}>
        <div className="popup-title">
          <h2>{userState === "newuser" ? "Sign up" : "Log in"}</h2>
          <img onClick={() => setShow(false)} src={assets.cross_icon} alt="" />
        </div>
        <hr />
        <div className="signup-input">
          {userState === "newuser" ? (
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={signupData.name}
              onChange={handleInput}
              required
            />
          ) : null}
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={signupData.email}
            onChange={handleInput}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={signupData.password}
            onChange={handleInput}
            required
          />
          <button
            type="submit"
            onClick={() => {
              if (isAuthenticated === true) setShow(false);
            }}
          >
            {userState === "newuser" ? "Create an account" : "Log in"}
          </button>
        </div>

        <div className="signup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
        {userState === "newuser" ? (
          <p>
            Already have an account?{" "}
            <span onClick={() => setUserState("registered")}>Login here</span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span onClick={() => setUserState("newuser")}>Click here</span>
          </p>
        )}
      </form>
    </div>
  );
}
