var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose
  .connect(
    "mongodb+srv://shivamshukla:shivamshukla123@shivamshukla.iozmxlc.mongodb.net/RMS"
  )
  .then(() => console.log("connection successful"))
  .catch((err) => console.error("MongoDB Error", err));

module.exports = mongoose.connection;
