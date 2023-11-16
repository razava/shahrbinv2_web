import React from "react";
import ReactMapboxGl, { Marker, ZoomControl } from "react-mapbox-gl";
import locationImg from "../../../assets/Images/location.svg";

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoibW9qaTc3OTgiLCJhIjoiY2trbGFwaWVvMngyZjJwcGF2OXo3YTdoeCJ9.UxvZqSaLRiN0J2qaF3TJrA",
  zoom: 9,
});

const ShowOnMap = ({ location, width = 400, height = 400, zoom = 9 }) => {
  return (
    <div
      style={{
        width: width,
        height: height,
      }}
    >
      <Map
        zoom={[12]}
        center={[
          location.longitude ? location.longitude : 54.3569,
          location.latitude ? location.latitude : 31.8974,
        ]}
        containerStyle={{ height: height, width: width }}
        style={`https://api.parsimap.ir/styles/parsimap-streets-v11?key=p18879615a54484eb98d403da218956ecaa2740c42`}
      >
        <Marker
          coordinates={[
            location.longitude ? location.longitude : 54.3569,
            location.latitude ? location.latitude : 31.8974,
          ]}
        >
          <img src={locationImg} />
        </Marker>
      </Map>
    </div>
  );
};

export default ShowOnMap;
