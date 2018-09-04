import PropTypes from "prop-types";
import React from "react";
import Header from "../Header";
import "./Layout.css";

const Layout = props => (
  <div className="layout">
    <Header />
    <div className="app">{props.children}</div>
  </div>
);

Layout.propTypes = {
  children: PropTypes.node,
};

Layout.defaultProps = {
  children: null,
};

export default Layout;
