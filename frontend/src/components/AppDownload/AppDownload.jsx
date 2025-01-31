import React, { useEffect } from "react";
import "./appdownload.css";
import { assets } from "../../assets/assets";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function AppDownload() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.state]);

  return (
    <div className="app-download" id="mobile">
      <motion.div
        className="app-left"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: "easeIn" }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
      >
        <h3>
          Get the <span>SwiftGo</span> App Now!
        </h3>
        <p>For best offers and discounts curated specially for you.</p>
        <div className="store-logo">
          <img src={assets.play_store} alt="" />
          <img src={assets.app_store} alt="" />
        </div>
      </motion.div>
      <img className="app-right" src="App_download.png" />
    </div>
  );
}
