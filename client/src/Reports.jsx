import { useState, useEffect, useContext } from "react";
import Table from "react-bootstrap/Table";
import { UilClock, UilUpload, UilEye } from "@iconscout/react-unicons";
import axios from "axios";
import { Context } from "./App";

const Reports = () => {
  const { connectedData } = useContext(Context);
  const [connected] = connectedData;

  const [reports, setReports] = useState(null);
  console.table(reports);

  useEffect(() => {
    if (reports) {
      localStorage.setItem("reports", JSON.stringify(reports));
      console.log("reports", reports);
    }

  }, [reports]);

  useEffect(() => {
    if (connected) {
      try {
        const getReports = async () => {
          const localReports = JSON.parse(localStorage.getItem("reports")) || []
          const reportsResponse = await axios.post("http://localhost:8080/seens", localReports.filter((report) => report.status === "uploaded").map((report) => report.id))
          console.log("🚀 ~ getReports ~ reportsResponse:", reportsResponse.data)
          const seens = reportsResponse.data
          const newReports = localReports.map((report) => ({ ...report, status: seens.find((seenReport) => seenReport.id === report.id)?.status || report.status }))
          console.log("🚀 ~ getReports ~ newReports:", newReports)
          setReports(newReports)
        }
        getReports();
      } catch (ex) {
      }
    } else {
      setReports(JSON.parse(localStorage.getItem("reports")) || []);

    }


  }, []);

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
