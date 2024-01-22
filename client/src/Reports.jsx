import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { UilClock, UilUpload, UilEye } from "@iconscout/react-unicons";

const Reports = () => {
  const [reports, setReports] = useState(null);
  console.table(reports);

  useEffect(() => {
    if (reports) {
      localStorage.setItem("reports", JSON.stringify(reports));
      console.log("reports", reports);
    }
  }, [reports]);

  useEffect(() => {
    setReports(JSON.parse(localStorage.getItem("reports")) || []);
  }, []);

  const getStatusIcon = (status) => {
    if (status === "uploaded") {
      return <UilUpload size="30" />;
    }
    if (status === "read") {
      return <UilEye size="30" />;
    }
    return <UilClock size="30" />;
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Species</th>
          <th>Disease</th>
          <th>Notes</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {reports &&
          reports.map(
            ({ id, datetime, treeName, treeDisease, notes, status }) => (
              <tr>
                <td>{id}</td>
                <td>{datetime}</td>
                <td>{treeName}</td>
                <td>{treeDisease}</td>
                <td>{notes}</td>
                <td>{getStatusIcon(status)}</td>
              </tr>
            )
          )}
      </tbody>
    </Table>
  );
};

export default Reports;
