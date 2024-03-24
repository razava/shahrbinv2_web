import React, { useState, useRef, useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import TileWMS from "ol/source/TileWMS";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";
import Draw from "ol/interaction/Draw";
import { click } from "ol/events/condition";
// import { Modify, Snap } from "ol/interaction";
import { transform } from "ol/proj"; // Import the transform function from ol/proj
// import GeoJSON from "ol/format/GeoJSON.js";
import { Polygon } from 'ol/geom'; // Import Polygon geometry from OpenLayers 
import scatter from "../../../assets/Images/scatter.png";
import Button from "../../helpers/Button";

function ScatterMap({
  width = 400,
  height = 400,
  center = [54.3569, 31.8974],
  zoom = 9,
  locations = [],
  className = "",
  mode = "chart",
  getLocations,
  handelDrawInteraction,
}) {
  const [map, setMap] = useState();
  const [layer, setLayer] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [vector, setVector] = useState();
  const [feature, setFeature] = useState();
  const [drawInteraction, setDrawInteraction] = useState(null);
  const mapElement = useRef();
  const locationsRef = useRef();
  mapElement.current = map;

  console.log(locations);
  useEffect(() => {
    if (map) {
      if (mode == "chart") {
        console.log(112);
        addMarkerLayer();
      }
      addDrawInteraction();
      if (localStorage.getItem("MapView") && map) {
        const v = JSON.parse(localStorage.getItem("MapView"));
        map.getView().fit(v, map.getSize());
      }
    }
  }, [map, locations]);

  useEffect(() => {}, [map]);
  const addMarkerLayer = () => {
    if (layer) map.removeLayer(layer);

    const iconFeatures = createMarkers(locations);
    let vectorSource = new VectorSource({
      features: iconFeatures,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);
    setLayer(vectorLayer);
  };

  const createMarkers = (locations) => {
    const pointMarkers = locations.map(
      (l) => new Point(fromLonLat([l.longitude, l.latitude]))
    );

    let iconFeatures = pointMarkers.map(
      (p) =>
        new Feature({
          geometry: p,
          name: "Null Island",
          population: 4000,
          rainfall: 500,
        })
    );

    let iconStyle = new Style({
      image: new Icon({
        src: scatter,
      }),
    });

    iconFeatures.forEach((i) => i.setStyle(iconStyle));
    setMarkers(iconFeatures);
    return iconFeatures;
  };

  const addDrawInteraction = () => {
    const source = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: source,
    });
    const draw = new Draw({
      source: source,
      type: "Polygon", // Set the type of geometry to draw here
      // You can set other options like style, etc.
    });

    draw.on("drawend", (event) => {
      event.stopPropagation();
      // Here you can handle the drawn feature, e.g., add it to state, etc.
      const feature = event.feature;
      // Do something with the drawn feature
      console.log("Circle drawn:", feature.getGeometry());
      // console.log("Circle drawn:", feature.getGeometry().getCoordinates());
      const geometry = feature.getGeometry();
      const coordinates = geometry.getCoordinates();
      // console.log(coordinates);
      // console.log(coordinates[0]);
      const lonLatCoordinates = coordinates[0].reverse().map((coord) => {
        // transform(coord, "EPSG:3857", "EPSG:4326");
        // console.log(coord);
        // console.log(transform(coord, "EPSG:3857", "EPSG:4326"));
        return transform(coord, "EPSG:3857", "EPSG:4326");
      });
      // console.log(
      //   transform(
      //     [8732987.679175382, 1920132.5190330548],
      //     "EPSG:3857",
      //     "EPSG:4326"
      //   )
      // );
      var extent = feature.getGeometry().getExtent();
      console.log(extent);
      map.getView().fit(extent, map.getSize());
      // map.getView().fit(feature.getGeometry(), map.getSize());
      const flatCoordinates = lonLatCoordinates.reduce(
        (acc, subList) => [...acc, ...subList],
        []
      );
      localStorage.setItem("MapView", JSON.stringify(extent));
      if (mode == "chart") {
        getLocations(flatCoordinates);
      }
      // handelDrawInteraction(flatCoordinates);
      setDrawInteraction(flatCoordinates);
    });

    // Add snapping and modifying interactions if needed
    // const modify = new Modify({ source: source });
    // const snap = new Snap({ source: source });
    setVector(vectorLayer);
    map.addInteraction(draw);
    map.addLayer(vectorLayer);
    // map.addInteraction(modify);
    // map.addInteraction(snap);
    // map.removeInteraction(draw);
    // return map.removeLastPoint;
  };

  useEffect(() => {
    const initalFeaturesLayer = new TileLayer({
      extent: [
        -20037508.342789244, -20037508.342789244, 20037508.342789244,
        20037508.342789244,
      ],
      source: new TileWMS({
        url: process.env.REACT_APP_MAP_PROXY_URL,
        params: {
          layers: "osm",
          srs: "EPSG:3857",
          exceptions: "application/vnd.ogc.se_inimage",
          transparent: true,
        },
      }),
    });

    const initialMap = new Map({
      target: mapElement.current,
      layers: [initalFeaturesLayer],
      view: new View({
        projection: "EPSG:3857",
        center: fromLonLat(center),
        zoom,
        // minZoom:10
      }),
      controls: [],
    });

    setMap(initialMap);

    return () => {};
  }, []);

  return (
    <div>
      <div
        ref={mapElement}
        onClick={(e) => e.stopPropagation()}
        id="map"
        className={className}
        style={{ width, height, cursor: "pointer" }}
      ></div>
      <div className=" flex gap-2">
        <Button
          title="پاک کردن"
          className="py1 br05 bg-primary text-white mx-auto my-2"
          onClick={() => {
            map.removeLayer(vector);
            addDrawInteraction();
          }}
          // loading={createLoading}
        />
        {mode == "filter" && (
          <Button
            title="تایید"
            className="py1 br05 bg-primary text-white mx-auto my-2"
            onClick={() => {
              map.removeLayer(vector);
              addDrawInteraction();
              handelDrawInteraction(drawInteraction);
            }}
            // loading={createLoading}
          />
        )}
      </div>
    </div>
  );
}

export default ScatterMap;
