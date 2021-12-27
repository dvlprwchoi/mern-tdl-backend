require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL);

app.listen(PORT, () => {
  console.log(`✅!!!SERVER IS RUNNING ON PORT:${PORT}!!!✅`);
});
