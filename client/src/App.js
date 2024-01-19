import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";




function App() {
  const [connected, setConnected] = useState(false);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  function handleLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, {
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: Infinity
      });
    } else {
      console.log("Geolocation not supported");
    }
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLat(latitude)
    setLong(longitude)
    console.log(`https://www.google.com/maps/embed?ll=${latitude},${longitude}`)
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  const checkConnection = () => {
    axios
      .get("http://localhost:8080/", {})
      .then((res) => {
        console.log(res.status);
        if (res.status === 200) {
          setConnected(true);
        } else {
          setConnected(false);
        }
      })
      .catch((err) => {
        setConnected(false);
        console.error(err);
      });
  };

  useEffect(() => {
    checkConnection();
    var intervalId = window.setInterval(function () {
      checkConnection();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <div className="App">
      <div style={{
        width: '100px', height: '100px', backgroundColor: connected ? "green" : "red", borderRadius: 50, position: 'absolute', right: '2%', top: '2%', textAlign: 'center',
        verticalAlign: 'middle',
        lineHeight: '100px'
      }}>
        {connected ? "ONLINE" : "OFFLINE"}
      </div>

      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <button onClick={() => alert("hello world")}>Hello</button> */}
        <button onClick={handleLocationClick}>Location</button>
        {lat && <div className="google-map-code">
          <iframe src={`https://maps.google.com/maps?q=${lat},${long}&hl=es;z=14&output=embed`}></iframe>
        </div>}


        {/* <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div >
  );
}

export default App;
