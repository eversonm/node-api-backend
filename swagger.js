const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger.json'
const endpointsFiles = ['./routes/places-routes.js', './routes/users-routes.js']

swaggerAutogen(outputFile, endpointsFiles)