const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger.json'
const endpointsFiles = ['./routes/places-routes.js']

swaggerAutogen(outputFile, endpointsFiles)