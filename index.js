const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

require('dotenv').config();
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL);

app.use(cors());

app.listen(PORT, () => {
  console.log(`✅!!!SERVER IS RUNNING ON PORT:${PORT}!!!✅`);
});
