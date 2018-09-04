import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => (
  <div className="header">
    <header className="headerItems">
      <div>
        <Link to="/">Home</Link>
      </div>
    </header>
  </div>
);

export default Header;
