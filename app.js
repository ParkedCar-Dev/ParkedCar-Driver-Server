const express = require("express")
const cors = require("cors");
const db = require("./models");
require("dotenv").config();
const passport = require("passport");
require("./config/passportconfig")(passport);
const regRoute = require("./routes/register")
const authRoute = require("./routes/auth")
const protectedRoute = require("./routes/protected")
const searchRoute = require("./routes/search")

const app = express();
app.use(express.json())
app.use(cors())
app.use(passport.initialize())


db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.use("/search", searchRoute)
app.use("/register", regRoute)
app.use("/auth", authRoute)
app.use("/protected", passport.authenticate("jwt", {session: false}), protectedRoute)
app.use("/", (req, res) => {
  res.send("Welcome to hell!");
});


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("server has started on port: " + port)
})