import React, { useEffect } from "react";
import ReactMapboxGl from "react-mapbox-gl";

const Map = ReactMapboxGl({
  accessToken: "p18879615a54484eb98d403da218956ecaa2740c42",
});

const ParsiMap = () => {
  useEffect(() => {}, []);
  return (
    <Map
      zoom={[6]}
      center={[51.41, 35.7575]}
      style="https://api.parsimap.ir/styles/parsimap-streets-v11?key=p18879615a54484eb98d403da218956ecaa2740c42"
      containerStyle={{ height: "520px", width: "100%" }}
    />
  );
};

export default ParsiMap;
