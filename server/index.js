const express = require("express");
const mongoose = require("mongoose");
const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const Report = require("./model/Report");

const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const mongoDbUri =
  "mongodb+srv://edwarddavidwood:pD6mjLdbFfpH0Rf6@rainforestrangercluster.3bafszg.mongodb.net/?retryWrites=true&w=majority";

const connectToDb = async () => {
  try {
    await mongoose.connect(mongoDbUri, { dbName: "rainforestranger" });
    console.log("Connected to database");
  } catch (ex) {
    console.error(ex);
  }
};

connectToDb();

app.get("/", (req, res) => {
  res.send("Successfully Connected");
});

app.post("/identify", async (req, res) => {
  const base64 = req.body.tree;
  const plantData = await axios.post(
    "https://plant.id/api/v3/identification",
    { images: [base64], health: "auto" },
    {
      headers: {
        ["Api-Key"]: "XXWmCjQS1UIetuJE295vi4C4Q4XSU8i79wKFUCBZWHTJ5mOuWp",
      },
    }
  );
  const result = plantData?.data?.result;
  const species = result?.classification?.suggestions?.[0]?.name;
  const isHealthy = result?.is_healthy?.binary;
  const disease = !isHealthy && result?.disease?.suggestions?.[0]?.name;
  console.log(
    "Tree Uploaded",
    species,
    isHealthy ? "Healthy" : "Unhealthy - " + disease
  );
  res.send({
    species,
    disease,
  });
});

app.post("/upload", async (req, res) => {
  const data = req.body;
  console.log("uploaded data", data);
  const updatedAt = new Date();
  const upload = new Report({ ...data, status: "uploaded", updatedAt });
  upload.save();
  res.send({
    id: data.id,
    status: "uploaded",
    updatedAt,
  });
});

app.get("/reports", async (req, res) => {
  const reports = await Report.find();
  const seenReports = reports.map((report) => ({
    ...report._doc,
    status: "seen",
    updatedAt: new Date(),
  }));
  await Report.updateMany(
    {},
    {
      $set: {
        status: "seen",
        updatedAt: new Date(),
      },
    }
  );
  res.send(seenReports);
});

app.post("/seens", async (req, res) => {
  const data = req.body;
  const reports = await Report.find({
    id: { $in: data },
  });
  res.send(reports);
});

app.get("/surveys", async (req, res) => {
  const reports = await Report.find();
  const surveys = reports
    .map((report) => report.survey)
    .filter((survey) => survey && survey.length > 0);
  const uniqueSurveys = [...new Set(surveys)];
  res.send(uniqueSurveys);
});

app.listen(port, () => {
  console.log(`Rainforest Ranger server running on port ${port}`);
});
