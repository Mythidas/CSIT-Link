import express from "express";
import schedule from "node-schedule";
import axios from "axios";

const app = express();
const port = 2304;
const https = axios.create({
  baseURL: "https://localhost:2301/api/v2"
});

const rule = new schedule.RecurrenceRule();
rule.minute = 59;
rule.hour = 23;

// Sync devices at midnight everyday
const job = schedule.scheduleJob(rule, () => {
  https.post("https://localhost:2301/api/v2/devices/sync", {
    method: "POST"
  });

  axios.post("/devices/sync");
})

https.post("/test");

console.log(`Next sync at: ${job.nextInvocation().toISOString()}`);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});