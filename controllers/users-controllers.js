const { v4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Test User",
    email: "test@gmail.com",
    password: "test12pass",
  },
];

const getAllUsers = (req, res, next) => {
  // #swagger.tags= ['Users']
  // #swagger.description = 'Find all users'
  /* #swagger.responses[200] = { 
      schema: { 
        $ref: "#/definitions/Users" 
      },
    } */

  res.status(200).json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  // #swagger.path = '/api/users/'
  // #swagger.tags= ['Users']
  // #swagger.description = 'Create a new user using name, email and password'
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError(
      "Invalids inputs passed, please check your user data.",
      422
    );
  }

  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);

  if (hasUser) {
    throw new HttpError("Could not create user, email already exists.", 422);
  }

  const createdUser = {
    id: v4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  // #swagger.path = '/api/users/something/'
  // #swagger.tags= ['Users']
  // #swagger.description = 'Log in a user'
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      "Could not identify user, credentials seem to be wrong!",
      401
    );
  }
  res.json({ message: "Logged in!" });
};

module.exports = {
  getAllUsers,
  signup,
  login,
};
