const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getAllUsers = async (req, res, next) => {
  // #swagger.tags= ['Users']
  // #swagger.description = 'Find all users'
  /* #swagger.responses[200] = { 
      schema: { 
        $ref: "#/definitions/Users" 
      },
    } */
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed! Please try again later.",
      500
    );
    return next(error);
  }

  res
    .status(200)
    .json({ users: users.map((u) => u.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  // #swagger.path = '/api/users/'
  // #swagger.tags= ['Users']
  // #swagger.description = 'Create a new user using name, email and password'
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalids inputs passed, please check your user data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed! Please try again later.",
      500
    );
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError(
      "User exists already! Please login instead.",
      422
    );
    return next(error);
  }
  const createdUser = new User({
    name,
    email,
    image:
      "https://icons.iconarchive.com/icons/dakirby309/windows-8-metro/128/Folders-OS-User-No-Frame-Metro-icon.png",
    password,
    places: [],
  });

  try {
    await createdUser.save(); //handle all mongoDB code to save and store a document
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signing up failed! Please try again.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  // #swagger.tags= ['Users']
  // #swagger.description = 'Log in a user'
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed! Please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials! Could not log you in.",
      401
    );
    return next(error);
  }
  res.json({ message: "Logged in!" });
};

module.exports = {
  getAllUsers,
  signup,
  login,
};
