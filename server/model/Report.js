const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  id: String,
  species: String,
  disease: String,
  datetime: Date,
  readAt: Date,
  notes: String,
  status: String,
  image: String,
  location: {
    latitude: String,
    longitude: String,
  },
  survey: String,
  user: String,
});

module.exports = mongoose.model("Report", reportSchema);
