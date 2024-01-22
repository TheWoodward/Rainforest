import axios from "axios"
import { useEffect, useState } from "react"
import Table from "react-bootstrap/Table";
import { UilClock, UilUpload, UilEye } from "@iconscout/react-unicons";

const Analysis = () => {
  const [reports, setReports] = useState([])
  console.table(reports)

  useEffect(() => {
    const getReports = async () => {
      const reportsResponse = await axios.get("http://localhost:8080/reports")
      setReports(reportsResponse.data)
    }
    getReports();
  }, [])

  const getStatusIcon = (status) => {
    if (status === "uploaded") {
      return <UilUpload size="30" />;
    }
    if (status === "read") {
      return <UilEye size="30" />;
    }
    return <UilClock size="30" />;
  };

  return <Table striped bordered hover>
    <thead>
      <tr>
        <th>ID</th>
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
          ({ id, user, datetime, species, age, size, disease, notes, location, status }) => (
            <tr>
              <td>{id}</td>
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
}

export default Analysis;