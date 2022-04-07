const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger.json");

const placesRoutes = require("./routes/places-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(express.json());

app.use("/api/places", placesRoutes);

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


app.listen(5000);
