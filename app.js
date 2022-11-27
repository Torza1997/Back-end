require("dotenv").config();
const fs = require("fs");
const cors = require("cors");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// const logger = require("./middleware/logger");

//middleware
// app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//routes api
app.use("/api", require("./router/api/all"));
app.get("/test-api", (req, res) => {
  res.send('hello world').end();
});


app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
