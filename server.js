const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

//connecting to the mongoDB data  base
mongoose.connect(DB).then(
  () => {
    console.log("connection si successfull");
  },
  (err) => console.log(err)
);

const PORT = process.env.PORT || 8080;

//listening to the express app at port 3000
app.listen(PORT, () => {
  console.log("listening to the port 3000");
});
