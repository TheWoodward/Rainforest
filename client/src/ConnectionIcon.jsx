import { UilWifi, UilWifiSlash } from "@iconscout/react-unicons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Button from "react-bootstrap/Button";

const popoverConnected = (
  <Popover id="popover-basic">
    <Popover.Header as="h3">
      You are <strong>online</strong>
    </Popover.Header>
    <Popover.Body>
      You currently have an internet connection, your uploads will be
      automatically synced.
    </Popover.Body>
  </Popover>
);

const popoverDisconnected = (
  <Popover id="popover-basic">
    <Popover.Header as="h3">
      You are <strong>offline</strong>
    </Popover.Header>
    <Popover.Body>
      You do not currently have an internet connection, your uploads will be
      synced when your connection is restored.
    </Popover.Body>
  </Popover>
);

const ConnectionIcon = () => {
  const [connected, setConnected] = useState(false);

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
    var connectionChecker = window.setInterval(function () {
      checkConnection();
    }, 5000);

    return () => {
      clearInterval(connectionChecker);
    };
  }, []);

  return (
    <OverlayTrigger
      placement="bottom"
      overlay={connected ? popoverConnected : popoverDisconnected}
    >
      <Button variant="link">
        {connected ? (
          <UilWifi size="30" color="lightgrey" />
        ) : (
          <UilWifiSlash size="30" color="darkred" />
        )}
      </Button>
    </OverlayTrigger>
  );
};

export default ConnectionIcon;