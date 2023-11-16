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
import scatter from "../../../assets/Images/scatter.png";

function ScatterMap({
  width = 400,
  height = 400,
  center = [54.3569, 31.8974],
  zoom = 9,
  locations = [],
  className=""
}) {
  const [map, setMap] = useState();
  const [layer, setLayer] = useState(null);
  const [markers, setMarkers] = useState([]);

  const mapElement = useRef();
  const locationsRef = useRef();
  mapElement.current = map;

  useEffect(() => {
    if (map) {
      addMarkerLayer();
    }
  }, [locations]);

  const addMarkerLayer = () => {
    if (layer) map.removeLayer(layer);
    const iconFeatures = createMarkers(locations);
    let vectorSource = new VectorSource({
      features: iconFeatures,
    });

    vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    map.addLayer(vectorLayer);
    setLayer(vectorLayer);
  };

  let vectorLayer;

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
        // scale,
      }),
    });

    iconFeatures.forEach((i) => i.setStyle(iconStyle));
    setMarkers(iconFeatures);
    return iconFeatures;
  };

  const onZoom = () => {
    if (mapElement?.current) {
      const radius = mapElement?.current.getView().getZoom();
      const scale = (19 - radius) / 9;

      addMarkerLayer(mapElement?.current, scale);
    }
  };

  useEffect(() => {
    // create and add vector source layer
    const initalFeaturesLayer = new TileLayer({
      extent: [
        -20037508.342789244, -20037508.342789244, 20037508.342789244,
        20037508.342789244,
      ],
      source: new TileWMS({
        url: process.env.REACT_APP_MAP_PROXY_URL,
        params: {
          layers: "osm",
          // format: "image/png",
          srs: "EPSG:3857",
          exceptions: "application/vnd.ogc.se_inimage",
          transparent: true,
        },
      }),
    });

    // create map
    const initialMap = new Map({
      target: mapElement.current,
      layers: [
        // USGS Topo
        // new TileLayer({
        //   source: new OSM(),
        // }),

        initalFeaturesLayer,
        // vectorLayer,
      ],
      view: new View({
        projection: "EPSG:3857",
        center: fromLonLat(center),
        zoom,
      }),
      controls: [],
    });

    // save map and vector layer references to state
    // initialMap.addEventListener("moveend", onZoom);
    setMap(initialMap);
    mapElement.current = initialMap;
    // setFeaturesLayer(initalFeaturesLayer);
    return () => {};
  }, []);

  return (
    <div
      ref={mapElement}
      id="map"
      className={className}
      style={{ width, height, cursor: "pointer" }}
    ></div>
  );
}

export default ScatterMap;
