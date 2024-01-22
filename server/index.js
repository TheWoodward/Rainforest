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
    console.log("Connected to MongoDB");
  } catch (ex) {
    console.error(ex);
  }
};

connectToDb();

app.get("/", (req, res) => {
  res.send("Hello World!");
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
  console.log("🚀 ~ app.post ~ result:", result?.disease?.suggestions);
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
  // console.log(plantData);
  // console.log(req);
  // res.send("Hello World!");
});

app.post("/upload", async (req, res) => {
  const data = req.body;
  console.log("uploaded data", data);
  const upload = new Report(data);
  upload.save();
  res.send({
    id: data.id,
    status: "uploaded",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
