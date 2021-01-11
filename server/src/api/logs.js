/* eslint-disable linebreak-style */
/* eslint-disable quotes */
const { Router } = require("express");
const LogEntry = require("../models/LogEntry");

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const entries = await LogEntry.find();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  //console.log(req.headers.x_api_key);
  try {
    if (req.get("X-API-KEY") !== process.env.API_KEY) {
      res.status(401);
      throw new Error("UnAuthorized");
    }
    const logEntry = new LogEntry(req.body);
    const createdEntry = await logEntry.save();
    res.json(createdEntry);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.statusCode(400);
    }
    next(error);
  }
});

module.exports = router;
