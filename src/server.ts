import loggerFactory from "./lib/logger";
const logger = loggerFactory("server");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
import createJob from "./lib/jobQueue/createJob";
const app = express();

app.get("/api/v1/probes", (req, res) => {
    res.send("FY");
});

app.post("/api/v1/probes", [cors(), bodyParser.text()], (req, res) => {
    logger.info("API Hit");
    createJob("probe_report", req.body);
    res.send("ack");
});

app.listen(8002, () => console.log("WebServer is Ready to go!"));

// Handle any uncaught Exception. This should never been happening in production,
// but it is really usefull in dev
process.on("uncaughtException", function(err) {
    logger.error(err.toString());
});

// Handle any unhandled promise rejection. This should never been happening in production,
// but it is really usefull in dev
process.on("unhandledRejection", function(err) {
    console.error("Error", err);
});
