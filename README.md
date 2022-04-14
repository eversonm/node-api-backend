# Node-API-backend
*Node.js &amp; Express.js - Building a REST API*

## Modules
[axios](https://www.npmjs.com/package/axios) <br>
[bcrypt](https://www.npmjs.com/package/bcrypt) <br>
[cors](https://www.npmjs.com/package/cors)<br>
[express](https://www.npmjs.com/package/express) <br>
[express-validator](https://www.npmjs.com/package/express-validator) <br>
[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) <br>
[mongoose-unique-validator](https://www.npmjs.com/package/mongoose-unique-validator)<br>
[multer](https://www.npmjs.com/package/multer) <br>
[swagger-autogen](https://www.npmjs.com/package/swagger-autogen)<br>
[swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)<br>

## Dev module
[nodemon](https://www.npmjs.com/package/nodemon)<br>

## Dependencies
*A google api key and access to mongodb server ([atlas](https://www.mongodb.com/atlas/database) or local)*

## Options
*The development server needs a nodemon.json file on root folder and access to some mongodb server*
<pre><code>
{
  "env": {
    "DB_USER": "DB_USER_NAME",
    "DB_PASSWORD": "DB_USER_PASSWORD",
    "DB_NAME": "DB_NAME",
    "DB_CLUSTER": "DB_CLUSTER_URL",
    "GOOGLE_API_KEY": "YOUR_API_KEY",
    "JWT_KEY": "YOUR_SECRET_KEY"
  }
}
</code></pre>

### Swagger docs link
<b>http://localhost:5000/doc</b>

### Update swagger docs
*npm run swagger-autogen*

### Start project
*npm start*