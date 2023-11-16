import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Home = (props) => {
  return (
    <div>
      <span>صفحه اصلی</span>
      <Link to="/admin/newReports">درخواست ها</Link>
      <Link to="/admin/new-ideas">ایده ها</Link>
      <Link to="/login">لاگین</Link>
    </div>
  );
};

Home.propTypes = {};

export default Home;
