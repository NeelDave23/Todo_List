const express = require("express");
const app = express();
const route = require("./routes/routes");
let cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/todo", route);

app.get("/", (req, res) => {
  res.send("Home");
});

app.listen(3000, () => {
  console.log("Listerning on Port 3000");
});
