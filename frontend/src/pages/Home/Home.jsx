import React, { useState } from "react";
import "./home.css";
import Hero from "../../components/Hero/Hero";
import AppDownload from "../../components/AppDownload/AppDownload";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";

const Home = ({ setShow }) => {
  return (
    <div className="home">
      <Hero setShow={setShow} />
      <div className="about-us-home">
        <motion.img
          variants={fadeIn("right", 0.1)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.5 }}
          src="left-img.png"
          alt=""
        />
        <motion.p
          variants={fadeIn("up", 0.1)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.5 }}
        >
          Welcome to <span>Swift Go</span>, the ultimate destination for all
          your food cravings! At Swift Go, we redefine the food delivery
          experience by offering not just convenience but also a rich variety of
          delicious dishes tailored to your tastes. Whether you're in the mood
          for a hearty meal, a light snack, or something truly unique, our
          seamless app design ensures you can browse, filter, and choose your
          favorite dishes effortlessly. With features like personalized
          recommendations, exclusive deals, and a user-friendly interface,
          ordering food has never been this enjoyable. Plus, our commitment to
          speed and quality guarantees that every meal arrives fresh and on
          time. Join Swift Go today, and let us bring the joy of dining directly
          to your doorstep!
        </motion.p>
        <motion.img
          variants={fadeIn("left", 0.1)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.5 }}
          src="right-img.png"
          alt=""
        />
      </div>

      <AppDownload />

      <div className="sustainable-block">
        <motion.h3
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 1 }}
        >
          Sustainability at Swift-Go
        </motion.h3>
        <p>
          Our sustainability objectives are aligned with our mission to elevate
          the quality of life of urban consumers, and the United Nations
          Sustainable Development Goals (SDGs)
        </p>
        <motion.div
          className="sustainable-inner-block"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 1 }}
        >
          <h5>Our commitment to UNSDG Goals</h5>
          <div className="image-row">
            <img src="unsdg1.png" alt="" width="100px" />
            <img src="unsdg2.png" alt="" width="100px" />
            <img src="unsdg3.png" alt="" width="100px" />
            <img src="unsdg4.png" alt="" width="100px" />
            <img src="unsdg5.png" alt="" width="100px" />
            <img src="unsdg6.png" alt="" width="100px" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
