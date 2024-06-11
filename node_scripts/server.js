import express from "express";
import schedule from "node-schedule";

const app = express();
const port = 2304;

const rule = new schedule.RecurrenceRule();
rule.minute = 59;
rule.hour = 23;

// Sync devices at midnight everyday
const job = schedule.scheduleJob(rule, () => {
  fetch("https://localhost:2301/api/v2/devices/sync", {
    method: "POST"
  });
})

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

fetch("https://localhost:2301/api/v2/test", {
  method: "POST"
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});