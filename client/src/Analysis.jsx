import axios from "axios";
import { useEffect, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { CSVLink } from "react-csv";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ReportsTable from "./ReportsTable";

const flattenObject = (ob) => {
  var toReturn = {};

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == "object" && ob[i] !== null) {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + "." + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};

const Analysis = () => {
  const [reports, setReports] = useState([]);
  const [countsData, setCountsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [species, setSpecies] = useState([]);

  const greens = [
    "green",
    "darkgreen",
    "limegreen",
    "forestgreen",
    "lightgreen",
    "darkolivegreen",
    "darkseagreen",
    "greenyellow",
    "lawngreen",
  ];

  useEffect(() => {
    const getReports = async () => {
      const reportsResponse = await axios.get("http://localhost:8080/reports");
      setReports(reportsResponse.data);
    };
    getReports();
  }, []);

  useEffect(() => {
    const countsDataObject = {};
    const usersDataObject = {};

    const reportsSpecies = new Set();

    reports.forEach((report) => {
      if (report.species) {
        reportsSpecies.add(report.species);
      }

      if (report.user) {
        if (usersDataObject[report.user]) {
          usersDataObject[report.user] += 1;
        } else {
          usersDataObject[report.user] = 1;
        }
      }

      if (report.survey) {
        if (countsDataObject[report.survey]) {
          if (countsDataObject[report.survey][report.species]) {
            countsDataObject[report.survey][report.species] += 1;
          } else {
            countsDataObject[report.survey][report.species] = 1;
          }
        } else {
          countsDataObject[report.survey] = { [report.species]: 1 };
        }
      }
    });
    const usersDataArray = Object.keys(usersDataObject).map((user) => ({
      user,
      count: usersDataObject[user],
    }));
    setUsersData(usersDataArray);

    const countsDataArray = Object.keys(countsDataObject).map((survey) => ({
      survey,
      ...countsDataObject[survey],
    }));
    setCountsData(countsDataArray);

    setSpecies([...reportsSpecies]);
  }, [reports]);

  return (
    <>
      <ReportsTable reports={reports}></ReportsTable>
      <Container style={{ paddingTop: 50 }}>
        <Row>
          <Col>
            <p>Species count by Survey:</p>
            <BarChart
              width={500}
              height={300}
              data={countsData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="survey" />
              <YAxis />
              <Tooltip />
              <Legend />
              {species.map((type, index) => (
                <Bar
                  dataKey={type}
                  fill={greens[index % greens.length]}
                  activeBar={<Rectangle stroke="black" />}
                />
              ))}
            </BarChart>
          </Col>
          <Col>
            <p>User Reports:</p>
            <BarChart
              width={500}
              height={300}
              data={usersData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="user" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="count"
                fill="forestgreen"
                activeBar={<Rectangle stroke="black" />}
              />
            </BarChart>
          </Col>
          <Col>
            <div>
              <p>Looking for more analysis? Export to Google Sheets:</p>
              <CSVLink
                data={reports.map((report) => flattenObject(report))}
                filename={`RainforestRangerExport-${new Date().toLocaleDateString()}`}
                target="_blank"
              >
                <img
                  alt="Download CSV file for Google Sheets"
                  style={{ width: 150, padding: 10, margin: "auto" }}
                  src="data:image/png;base64,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"
                ></img>
              </CSVLink>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Analysis;
