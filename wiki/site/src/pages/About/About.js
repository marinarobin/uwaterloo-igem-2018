import React from "react";
import ReactMarkdown from "react-markdown";
import "./About.css";
import about from "./About.md";

const About = () => (
  <div className="about">
    <ReactMarkdown source={about} className="text" />
  </div>
);

export default About;
