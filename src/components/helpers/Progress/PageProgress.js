import React, { Component } from "react";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import "./style.css";

export default class Progress extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    nprogress.start();
  }

  componentDidMount() {
    nprogress.done();
  }

  render() {
    return <></>;
  }
}
