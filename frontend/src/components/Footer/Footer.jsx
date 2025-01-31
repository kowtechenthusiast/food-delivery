import React from "react";
import "./footer.css";
import { assets } from "../../assets/assets";

export default function Footer() {
  return (
    <div className="footer" id="contact">
      <div className="footer-top">
        <div className="footer-left">
          <img
            src="download__2_-removebg-preview.png"
            alt=""
            className="footer-logo"
          />
          <div className="footer-disc">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi vel
            laborum assumenda tenetur, minima at in.
          </div>
          <div className="social-icon">
            <a href="https://www.facebook.com/" target="blank">
              <img src={assets.facebook_icon} alt="" />
            </a>
            <a href="https://www.twitter.com" target="blank">
              <img src={assets.twitter_icon} alt="" />
            </a>
            <a href="https://www.linkedin.com" target="blank">
              <img src={assets.linkedin_icon} alt="" />
            </a>
          </div>
        </div>
        <div className="footer-center">
          <h2>COMPANY</h2>
          <ul className="footer-navigator">
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div className="footer-right">
          <h2>GET IN TOUCH</h2>
          <ul className="contact">
            <li>+1-453-237-5684</li>
            <li>contact@swiftgo.com</li>
          </ul>
        </div>
      </div>

      <div className="copyright">
        Copyright 2024 &copy; SwiftGo.com - All right reserved
      </div>
    </div>
  );
}
