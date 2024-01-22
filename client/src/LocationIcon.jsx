import { UilMapMarkerAlt, UilMapMarkerSlash } from "@iconscout/react-unicons";
import React, { useContext, useEffect } from "react";
import { Context } from "./App";

const LocationIcon = () => {
  const { latContext, longContext } = useContext(Context);

  const [lat, setLat] = latContext;
  const [long, setLong] = longContext;

  const locationSuccess = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLat(latitude);
    setLong(longitude);
  };

  const locationError = () => {
    setLat(null);
    setLong(null);
    console.log("Unable to retrieve your location");
  };

  const checkLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: Infinity,
      });
    } else {
      setLat(null);
      setLong(null);
      console.log("Geolocation not supported");
    }
  };

  useEffect(() => {
    checkLocation();
    var locationChecker = window.setInterval(function () {
      checkLocation();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(locationChecker);
    };
  }, []);

  return (
    <>
      {lat && long ? (
        <UilMapMarkerAlt size="30" color="lightgrey" />
      ) : (
        <UilMapMarkerSlash size="30" color="darkred" />
      )}
      {lat && long ? `${lat}, ${long}` : "Unknown"}
    </>
  );
};

export default LocationIcon;
