const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL;
const dbName = "db-contacts";

mongoose
  .connect(mongoUrl, { dbName, useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`Connected to MongoDB database "${dbName}"`);
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(`Error connecting to MongoDB database "${dbName}": ${error.message}`);
    process.exit(1);
  });
