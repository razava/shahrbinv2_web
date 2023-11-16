import React, { useState, useRef, useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import TileWMS from "ol/source/TileWMS";
import { transform, fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";
import marker from "../../../assets/Images/location.svg";

function OlMapContainer({
  width = 400,
  height = 400,
  center = [54.3569, 31.8974],
  zoom = 9,
  fetchAddress = (f) => f,
  clickable = true,
  setCoordinates,
  onMapClick = (f) => f,
  className = "",
}) {
  // other states
  const [map, setMap] = useState();

  // data states
  const [coords, setCoords] = useState(center);
  const [feature, setFeature] = useState(null);

  const mapElement = useRef();
  mapElement.current = map;

  const handleMapClick = (event) => {
    const clickedCoord = mapElement.current.getCoordinateFromPixel(event.pixel);
    const transormedCoord = transform(clickedCoord, "EPSG:3857", "EPSG:4326");
    setCoords(transormedCoord);
    setCoordinates({
      latitude: transormedCoord[1],
      longitude: transormedCoord[0],
    });
    fetchAddress({
      latitude: transormedCoord[1],
      longitude: transormedCoord[0],
    });
    onMapClick();
  };

  useEffect(async () => {
    if (map) {
      map.getView().setCenter(fromLonLat(center));
      feature.setCoordinates(fromLonLat(center));
    }
  }, [center]);

  useEffect(() => {
    const pointMarker = new Point(fromLonLat(coords));
    let iconFeature = new Feature({
      geometry: pointMarker,
      name: "Null Island",
      population: 4000,
      rainfall: 500,
    });

    let iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        src: marker,
      }),
    });

    iconFeature.setStyle(iconStyle);
    let vectorSource = new VectorSource({
      features: [iconFeature],
    });

    let vectorLayer = new VectorLayer({
      source: vectorSource,
      // maxZoom: 5,
    });

    setFeature(pointMarker);
    // create and add vector source layer
    const initalFeaturesLayer = new TileLayer({
      extent: [
        -20037508.342789244, -20037508.342789244, 20037508.342789244,
        20037508.342789244,
      ],
      maxZoom: 18,
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

        initalFeaturesLayer,
        vectorLayer,
      ],
      view: new View({
        projection: "EPSG:3857",
        // center: fromLonLat(coords),
        center: fromLonLat(coords),
        zoom,
      }),
      controls: [],
    });

    // save map and vector layer references to state
    setMap(initialMap);
    // setFeaturesLayer(initalFeaturesLayer);
    if (clickable) {
      initialMap.on("click", handleMapClick);
    }
  }, []);

  return (
    <div
      ref={mapElement}
      className={className}
      style={{ width, height, cursor: "pointer" }}
    ></div>
  );
}

export default OlMapContainer;
