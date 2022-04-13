const jwt = require("jsonwebtoken");

const secret_key = require("../jwtoken");
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed! Please try again.");
    }

    const decodedToken = jwt.verify(token, secret_key);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};
