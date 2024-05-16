import React, { useContext, useEffect, useRef, useState } from "react";
import { ParsiMap } from "../../../apiCalls";
import { AppStore } from "../../../store/AppContext";
import Loader from "../../helpers/Loader";
import TextInput from "../../helpers/TextInput";
import OlMapContainer from "../map/OlMapContainer";
import DialogButtons from "./DialogButtons";
import { callAPI } from "../../../helperFuncs";

const modalRoot = document && document.getElementById("modal-root");

const SelectOnMapDialog = ({
  width = "100%",
  height = "100%",
  saveChanges = (f) => f,
  defaultCoordinates = {
    latitude: process.env.REACT_APP_LATITUDE,
    longitude: process.env.REACT_APP_LONGITUDE,
  },
  defaultAddress = "",
  condition,
  setCondition = (f) => f,
  children,
}) => {
  const inputRef = useRef(null);

  // store
  const [store] = useContext(AppStore);

  console.log(store.initials.instance);

  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState({
    latitude:
      store.initials.instance.latitude || process.env.REACT_APP_LATITUDE,
    longitude:
      store.initials.instance.longitude || process.env.REACT_APP_LONGITUDE,
  });
  const [searchAddress, setSearchAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [geofences, setGeoFences] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(store.initials.instance);
  useEffect(() => {
    if (condition) {
      setCoordinates({
        latitude:
          store.initials.instance.latitude || defaultCoordinates.latitude,
        longitude:
          store.initials.instance.longitude || defaultCoordinates.longitude,
      });
      setSearchAddress(defaultAddress);
      setShowMap(true);
    } else {
      setShowMap(false);
    }
  }, [condition]);

  useEffect(() => {
    if (inputRef.current && condition) {
      inputRef.current.focus();
    }
  }, [inputRef.current, `condition`]);

  const fetchAddress = (coordinates) => {
    setLoading(true);
    callAPI({
      caller: ParsiMap.reverse,
      payload: coordinates,
      successCallback: (res) => {
        setLoading(false);
        console.log(res);
        setSearchAddress(res.data.address);
        // setAddressDetail(res.data.address);
        setGeoFences(res.data.regionId);
      },
      errorCallback: () => {},
      requestEnded: () => {},
    });
    // ParsiMap.reverse(coordinates).then((res) => {
    //   setLoading(false);
    //   if (res.status === 200) {
    //     setSearchAddress(res.data.address);
    //     setGeoFences(res.data.geofences);
    //   }
    // });
  };

  const getAddress = (value) => (e) => {
    if (e) {
      e.preventDefault();
    }
    setLoading(true);
    ParsiMap.routing(value).then((res) => {
      setLoading(false);
      console.log(res);
      if (
        res &&
        res?.data?.data?.results &&
        res?.data?.data?.results?.length > 0
      ) {
        console.log(res);
        setSearchResults(res.data.data.results);
      }
    });
  };

  const onSearch = (name) => (e) => {
    const value = e.target.value;
    setSearchAddress(value);

    getAddress(value)(undefined);
  };

  const goToLocation = (address) => (e) => {
    e.stopPropagation();
    const coordinates = {
      latitude: address.geo_location.center.lat,
      longitude: address.geo_location.center.lng,
    };
    setCoordinates(coordinates);
    fetchAddress(coordinates);
    setSearchAddress(address.description);
    setSearchResults([]);
  };

  const onMapClick = () => {
    setSearchResults([]);
  };

  const closeDialog = () => {
    setCondition(false);
    if (modalRoot.children.length === 2) {
      modalRoot.classList.remove("active");
    }
  };

  const onConfirm = () => {
    saveChanges(
      addressDetail ? addressDetail : searchAddress,
      coordinates,
      geofences
    );
    closeDialog();
  };
  return (
    <>
      <div className="w100">
        <form
          className="w100 frc relative"
          onSubmit={getAddress(searchAddress)}
        >
          <TextInput
            value={searchAddress}
            onChange={onSearch}
            forwardWrapperRef={inputRef}
            placeholder="جستجوی آدرس"
            icon="fas fa-search"
            wrapperClassName="w100"
            iconClassName="f15"
            onIconClick={getAddress(searchAddress)}
            autoFocus={true}
          />

          <section
            className={`bg-white w100 absolute z1 ${
              loading ? "mh100 frc" : "fcc"
            }`}
            style={{ top: "100%" }}
          >
            {loading ? (
              <Loader absolute={true} className="f12" />
            ) : (
              searchResults.map((result, i) => (
                <div
                  onClick={goToLocation(result)}
                  className="w100 frs px1 py05 pointer hv-light f12 text-dark"
                >
                  {result.description}
                </div>
              ))
            )}
          </section>
        </form>
        {showMap && (
          <OlMapContainer
            width={width}
            height={height - 60}
            center={[coordinates.longitude, coordinates.latitude]}
            zoom={15}
            fetchAddress={fetchAddress}
            setCoordinates={setCoordinates}
            onMapClick={onMapClick}
            className="px1"
          />
        )}
        <TextInput
          value={addressDetail}
          name="lastName"
          onChange={(name) => (e) => {
            const value = e.target.value;
            setAddressDetail(value);
          }}
          required={false}
          title="متن آدرس"
          wrapperClassName="col-md-12 col-sm-12"
        />
        {/* {children} */}
        <DialogButtons
          primaryTitle="تایید"
          onPrimaryClick={onConfirm}
          secondaryTitle="لغو"
          onSecondaryClick={closeDialog}
        />
      </div>
    </>
  );
};

export default SelectOnMapDialog;
