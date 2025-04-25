import express from "express";
import axios from "axios";
import morgan from "morgan";
import bodyParser from "body-parser";
import fs from "fs";
import { configDotenv } from "dotenv";
import { verify } from "crypto";

configDotenv();
const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());



app.get("/", (req, res) => {
  res.send("app is up and running");
});

app.get("/webhooks", (req, res) => {
  const query = req.query;
  console.log(query);

  const mode = query["hub.mode"];
  const token = query["hub.verify_token"];
  const challenge = query["hub.challenge"]; 

  if (mode && token) {
    if (mode == "subscribe" && token == process.env.VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.status(403).send("Forbidden");
    }
  }

  console.log(mode, token, challenge , "env token " ,process.env.VERIFY_TOKEN);
});


app.post("/webhooks", async (req, res) => {
  const data = req.body;
  const url = req.url;
  console.log("# URL : " , url )
  console.log("# DATA : ",data );
  console.log(data.entry.messaging)
})


app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});


