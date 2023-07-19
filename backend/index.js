const express = require("express"),
  cors = require("cors"),
  bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

const routes = require("./routes/routes");

app.use("/api", routes);

const port = process.env.PORT || 4100;

const server = app.listen(port, () => {
  console.log(`Connected to port ${port}`);
});
