const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const cors = require("cors");

const app = express();
app.use(cors());

let calendarData = [];
let listingsData = [];
let reviewsData = [];

// Read the CSV files
fs.createReadStream("./Dataset/calendar.csv")
  .pipe(csv())
  .on("data", (row) => {
    calendarData.push(row);
  })
  .on("end", () => {
    console.log("Calendar Data Loaded:", calendarData.length); // Log the data
  });

fs.createReadStream("./Dataset/listings.csv")
  .pipe(csv())
  .on("data", (row) => {
    listingsData.push(row);
  })
  .on("end", () => {
    console.log("Listings Data Loaded:", listingsData.length); // Log the data
  });

fs.createReadStream("./Dataset/reviews.csv")
  .pipe(csv())
  .on("data", (row) => {
    reviewsData.push(row);
  })
  .on("end", () => {
    console.log("Reviews Data Loaded:", reviewsData.length); // Log the data
  });

// Endpoint to get cleaned data
app.get("/api/data", (req, res) => {
  res.json({
    calendar: calendarData,
    listings: listingsData,
    reviews: reviewsData,
  });
});

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
