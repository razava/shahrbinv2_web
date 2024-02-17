/* eslint-disable */
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "./stylesheets/global.css";
import "./stylesheets/helpers.css";
import "./stylesheets/datatable.css";
import "./stylesheets/loader.css";
import mapboxgl from "mapbox-gl";
import AppContext from "./store/AppContext";
import AppContext2 from "./formStore/store";
import { createRoot } from "react-dom/client";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");

mapboxgl.setRTLTextPlugin(
  "https://cdn.parsimap.ir/third-party/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
  null
);

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter basename={baseUrl}>
    <AppContext2>
      <AppContext>
        <App />
      </AppContext>
    </AppContext2>
  </BrowserRouter>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
