const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Init Middleware
app.use(express.json({ extended: false })); // use() to use request object (req) from the routes and perform operations & express,json() to parse json in the req body

// simple endpoint for testing
app.get('/', (req, res) => {
  res.send('API Running');
});

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000; //if no env variable set (for heroku) then default to 5000 (for local)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
