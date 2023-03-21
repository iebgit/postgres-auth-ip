const { connection } = require("./services/db");
// require express
const express = require("express");
const app = express();
// require middleware
const morgan = require("morgan");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const router = require("./services/router");
const apiMetrics = require("prometheus-api-metrics");
const compose = require("docker-compose");
const path = require("path");
const userRouter = require("./services/users.js");

app.use(helmet());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.enable("trust proxy");

app.use(morgan("combined"));

app.use(bodyParser.json());

// app.use(userRouter);

// api metrics using a npm package that wraps prom-client
// uses /metrics endpoint
app.use(apiMetrics());

app.use("/health", function (req, res, next) {
  res.sendStatus(200);
});
app.use("/v1", router);

app.use(function (req, res, next) {
  res.json({
    version: "0.1.0",
    date: Date.now(),
    kubernetes: true,
  });
});

const PORT = parseInt(process.env.PORT) || 3000;

console.log("Listening on", PORT);
const server = app.listen(PORT);

// FOLLOWING IS TO DO GRACEFUL SHUTDOWN
setInterval(
  () =>
    server.getConnections((err, connections) =>
      console.log(`${connections} connections currently open`)
    ),
  10000
);

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

let connections = [];

server.on("connection", (connection) => {
  connections.push(connection);
  connection.on(
    "close",
    () => (connections = connections.filter((curr) => curr !== connection))
  );
});

function shutDown() {
  console.log("Received kill signal, shutting down gracefully");
  server.close(() => {
    console.log("Closed out remaining connections");
    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);

  connections.forEach((curr) => curr.end());
  setTimeout(() => connections.forEach((curr) => curr.destroy()), 5000);
}

// compose.upAll({ cwd: path.join(__dirname), log: true }).then(
//   () => {
//     console.log("done");
//   },
//   (err) => {
//     console.log("something went wrong:", err.message);
//   }
// );
