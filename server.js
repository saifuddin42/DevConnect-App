const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect to MongoDB
connectDB();

//simple endpoint for testing
app.get('/', (req, res) => {
  res.send('API Running');
});

const PORT = process.env.PORT || 5000; //if no env variable set (for heroku) then default to 5000 (for local)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
