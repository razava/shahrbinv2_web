import React, { useState, useRef, useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import TileWMS from "ol/source/TileWMS";
import { fromLonLat, transform } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";
import Draw from "ol/interaction/Draw";
import Button from "../../helpers/Button";
import scatter from "../../../assets/Images/scatter.png";

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
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: "" });
  const [drawingEnabled, setDrawingEnabled] = useState(true);
  const mapElement = useRef();
  const tooltipRef = useRef();

  mapElement.current = map;

  useEffect(() => {
    if (map) {
      if (mode === "chart") {
        addMarkerLayer();
      }

      // Clear existing interactions if any
      map.getInteractions().forEach((interaction) => {
        if (interaction instanceof Draw) {
          map.removeInteraction(interaction);
        }
      });

      if (drawingEnabled) {
        addDrawInteraction();
      }

      if (localStorage.getItem("MapView") && map) {
        const v = JSON.parse(localStorage.getItem("MapView"));
        map.getView().fit(v, map.getSize());
      }
    }
  }, [map, locations, drawingEnabled]);

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
          id: locations[index].reportId,
          trackingNumber: locations[index].trackingNumber,
          categoryTitle: locations[index].categoryTitle,
          address: locations[index].address,
          status: locations[index].status,
          customData: locations[index],
        })
    );

    let iconStyle = new Style({
      image: new Icon({
        src: scatter,
      }),
    });

    iconFeatures.forEach((i) => { i.setStyle(iconStyle); });

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
      condition: (event) => event.originalEvent.button === 0, // فقط کلیک چپ
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
  
    map.addInteraction(draw);
    map.addLayer(vectorLayer);
    setVector(vectorLayer);
  };
  

  // useEffect(() => {
  //   const initialFeaturesLayer = new TileLayer({
  //     extent: [
  //       -20037508.342789244, -20037508.342789244, 20037508.342789244,
  //       20037508.342789244,
  //     ],
  //     source: new TileWMS({
  //       url: process.env.REACT_APP_MAP_PROXY_URL,
  //       params: {
  //         layers: "osm",
  //         srs: "EPSG:3857",
  //         exceptions: "application/vnd.ogc.se_inimage",
  //         transparent: true,
  //       },
  //     }),
  //   });

  //   const initialMap = new Map({
  //     target: mapElement.current,
  //     layers: [initialFeaturesLayer],
  //     view: new View({
  //       projection: "EPSG:3857",
  //       center: fromLonLat(center),
  //       zoom,
  //     }),
  //     controls: [],
  //   });

  //   initialMap.on("click", () => {
  //     setTooltip({ show: false, x: 0, y: 0, content: "" });
  //   });

  //   initialMap.on("contextmenu", function (event) {
  //     event.preventDefault();
  //     if (!drawingEnabled) return; // Prevent drawing if disabled

  //     initialMap.forEachFeatureAtPixel(event.pixel, function (feature) {
  //       const properties = feature.getProperties();
  //       if (!properties || !properties.customData) {
  //         console.warn("Properties are undefined or missing");
  //         return;
  //       }

  //       const [x, y] = event.pixel;

  //       setTooltip({
  //         show: true,
  //         x,
  //         y,
  //         content: `
  //           <strong>شماره درخواست: </strong> ${properties.trackingNumber}<br><br>
  //           <strong>موضوع: </strong> ${properties.categoryTitle}<br><br>
  //           <strong>آدرس: </strong> ${properties.address}<br><br>
  //         `,
  //       });
  //       return true;
  //     });
  //   });

  //   setMap(initialMap);

  //   return () => {};
  // }, [drawingEnabled]);


  useEffect(() => {
    if (mapElement.current && !map) { // اطمینان از اینکه mapElement مقداردهی شده است
      const initialFeaturesLayer = new TileLayer({
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
        target: mapElement.current, // اینجا باید اطمینان حاصل کنید که mapElement مقداردهی شده
        layers: [initialFeaturesLayer],
        view: new View({
          projection: "EPSG:3857",
          center: fromLonLat(center),
          zoom,
        }),
        controls: [],
      });
  
      initialMap.on("click", () => {
        setTooltip({ show: false, x: 0, y: 0, content: "" });
      });
  
      initialMap.on("contextmenu", function (event) {
        event.preventDefault();
        if (!drawingEnabled) return; // Prevent drawing if disabled
  
        initialMap.forEachFeatureAtPixel(event.pixel, function (feature) {
          const properties = feature.getProperties();
          if (!properties || !properties.customData) {
            console.warn("Properties are undefined or missing");
            return;
          }
  
          const [x, y] = event.pixel;
  
          setTooltip({
            show: true,
            x,
            y,
            content: `
              <strong>شماره درخواست: </strong> ${properties.trackingNumber}<br><br>
              <strong>موضوع: </strong> ${properties.categoryTitle}<br><br>
              <strong>آدرس: </strong> ${properties.address}<br><br>
            `,
          });
          return true;
        });
      });

      setMap(initialMap); // نقشه ایجاد شده را ذخیره می‌کنیم
    }
  }, [mapElement, center, zoom, map]); // وابستگی‌ها را به درستی تنظیم کنید
  

  return (
    <div>
      <div
        ref={mapElement}
        onClick={(e) => e.stopPropagation()}
        id="map"
        className={className}
        style={{ width, height, cursor: "pointer" }}
      ></div>

      {tooltip.show && (
        <>
          <div
            ref={tooltipRef}
            style={{
              position: "absolute",
              top: tooltip.y - 60,
              left: tooltip.x - 100,
              backgroundColor: "#fff",
              color: "#333",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              padding: "12px 16px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              zIndex: 1000,
              pointerEvents: "none",
              fontSize: "14px",
              maxWidth: "220px",
              whiteSpace: "normal",
              wordWrap: "break-word",
              overflow: "hidden",
              textAlign: "right",
              direction: "rtl",
              transform: "translateX(-50%)",
            }}
            dangerouslySetInnerHTML={{ __html: tooltip.content }}
          />

          <div
            style={{
              position: "absolute",
              top: tooltip.y - 50,
              left: tooltip.x - 95,
              width: "0",
              height: "0",
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "10px solid #4A90E2",
              zIndex: 999,
              transform: "translateX(-50%)",
            }}
          ></div>
        </>
      )}

      <div className="flex gap-2">
        <Button
          title="پاک کردن"
          className="py1 br05 bg-primary text-white mx-auto my-2"
          onClick={() => {
            if (vector) {
              map.removeLayer(vector);
              setVector(null);
            }
            setDrawingEnabled(true); // Enable drawing
          }}
        />
        {mode === "filter" && (
          <Button
            title="تایید"
            className="py1 br05 bg-primary text-white mx-auto my-2"
            onClick={() => {
              if (vector) {
                map.removeLayer(vector);
                setVector(null);
              }
              handelDrawInteraction(drawInteraction);
              setDrawingEnabled(true); // Enable drawing
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ScatterMap;
