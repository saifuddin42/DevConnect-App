const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true, // used all
      useUnifiedTopology: true, // these to
      useCreateIndex: true, // remove
      useFindAndModify: false, // deprecation errors
    });

    console.log('MongoDB connected!');
  } catch (err) {
    console.log('Error while connecting to MongoDB: ', err.message);

    //Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
