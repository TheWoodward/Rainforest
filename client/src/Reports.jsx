import { UilClock, UilEye, UilUpload } from "@iconscout/react-unicons";
import { useContext, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { Context } from "./App";
import { getReports } from "./downloadHelpers";

const Reports = () => {
  const { connectedContext } = useContext(Context);
  const [connected] = connectedContext;

  const [reports, setReports] = useState([]);

  const updateReports = async () => {
    setReports(await getReports())
  }

  useEffect(() => {
    if (connected) {
      try {
        updateReports()
      } catch (ex) {
      }
    } else {
      setReports(JSON.parse(localStorage.getItem("reports")) || []);
    }
  }, [connected]);

  const getStatusIcon = (status) => {
    if (status === "uploaded") {
      return <UilUpload size="30" />;
    }
    if (status === "seen") {
      return <UilEye size="30" />;
    }
    return <UilClock size="30" />;
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Survey</th>
          <th>User</th>
          <th>Date</th>
          <th>Species</th>
          <th>Age</th>
          <th>Size</th>
          <th>Disease</th>
          <th>Notes</th>
          <th>Location</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {reports &&
          reports.map(
            ({ id, survey, user, datetime, species, age, size, disease, notes, location, status }) => (
              <tr>
                <td>{id}</td>
                <td>{survey}</td>
                <td>{user}</td>
                <td>{datetime}</td>
                <td>{species}</td>
                <td>{`${age} years`}</td>
                <td>{`${size}ft`}</td>
                <td>{disease}</td>
                <td>{notes}</td>
                <td>{location?.lat && location?.long ? `${location.lat}, ${location.long}` : ""}</td>
                <td>{getStatusIcon(status)}</td>
              </tr>
            )
          )}
      </tbody>
    </Table>
  );
};

export default Reports;
