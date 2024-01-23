import { useContext, useEffect, useState } from "react";
import { Context } from "./App";
import { getReports } from "./downloadHelpers";
import ReportsTable from "./ReportsTable";

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

  return (
    <ReportsTable reports={reports}></ReportsTable>
  );
};

export default Reports;
