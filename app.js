const express = require("express");
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger.json')

const placesRoutes = require("./routes/places-routes");

const app = express();

app.use(express.json());

app.use("/api/places", placesRoutes);


app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });

});
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(5000);
