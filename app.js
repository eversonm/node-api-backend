const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger.json");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const {
  USER_NAME,
  PASSWORD,
  CLUSTER_NAME,
  DB_NAME,
} = require("./mongodb-keys"); //contains credentials to access mongodb atlas
const HttpError = require("./models/http-error");

const app = express();

const url = `mongodb+srv://${USER_NAME}:${PASSWORD}@${CLUSTER_NAME}/${DB_NAME}?retryWrites=true&w=majority`;

app.use(express.json());

app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route!", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to mongodb Atlas!");
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
