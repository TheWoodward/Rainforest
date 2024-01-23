const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  id: String,
  species: String,
  disease: String,
  datetime: Date,
  updatedAt: Date,
  notes: String,
  status: String,
  image: String,
  location: {
    lat: Number,
    long: Number,
  },
  survey: String,
  user: String,
  age: Number,
  size: Number,
});

module.exports = mongoose.model("Report", reportSchema);
