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
import { transform } from "ol/proj";
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
  const [drawInteraction, setDrawInteraction] = useState(null);
  const mapElement = useRef();
  const locationsRef = useRef();
  mapElement.current = map;

  useEffect(() => {
    if (map) {
      if (mode === "chart") {
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
      (p, index) =>
        new Feature({
          geometry: p,
          name: `Marker ${index + 1}`,
          population: 4000 + index,
          rainfall: 500 + index,
          customData: locations[index], // Add custom data from the locations
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
      type: "Polygon",
    });

    draw.on("drawend", (event) => {
      event.stopPropagation();
      const feature = event.feature;
      const geometry = feature.getGeometry();
      const coordinates = geometry.getCoordinates();
      const lonLatCoordinates = coordinates[0].map((coord) => {
        return transform(coord, "EPSG:3857", "EPSG:4326");
      });
      var extent = feature.getGeometry().getExtent();
      map.getView().fit(extent, map.getSize());
      const flatCoordinates = lonLatCoordinates.reduce(
        (acc, subList) => [...acc, ...subList],
        []
      );
      localStorage.setItem("MapView", JSON.stringify(extent));
      if (mode === "chart") {
        getLocations(flatCoordinates);
      }
      setDrawInteraction(flatCoordinates);
    });

    setVector(vectorLayer);
    map.addInteraction(draw);
    map.addLayer(vectorLayer);
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
      }),
      controls: [],
    });

    // Add the singleclick event listener
    initialMap.on("singleclick", function (event) {
      initialMap.forEachFeatureAtPixel(event.pixel, function (feature) {
        const properties = feature.getProperties();
        console.log(properties);
        alert(
          `Clicked on: ${properties.name}\nPopulation: ${
            properties.population
          }\nRainfall: ${properties.rainfall}\nCustom Data: ${JSON.stringify(
            properties.customData
          )}`
        );
        return true; // Stop iteration after the first feature is found
      });
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
      <div className="flex gap-2">
        <Button
          title="پاک کردن"
          className="py1 br05 bg-primary text-white mx-auto my-2"
          onClick={() => {
            map.removeLayer(vector);
            addDrawInteraction();
          }}
        />
        {mode === "filter" && (
          <Button
            title="تایید"
            className="py1 br05 bg-primary text-white mx-auto my-2"
            onClick={() => {
              map.removeLayer(vector);
              addDrawInteraction();
              handelDrawInteraction(drawInteraction);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ScatterMap;
