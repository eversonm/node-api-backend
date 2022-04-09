// const { v4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");

const getPlaceById = async (req, res, next) => {
  // #swagger.tags= ['Places']
  // #swagger.description = 'Find a place using Id'
  /* #swagger.responses[200] = { 
      schema: { 
        $ref: "#/definitions/Places" 
      },
    } */
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong! Could not find a place.",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  // #swagger.path = '/api/places/user/{uid}'
  // #swagger.tags= ['Places']
  // #swagger.description = 'Find a place using a provided user id'
  const userId = req.params.uid;

  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed! Please try again later.",
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
  // res.json({ place: place.toObject({ getters: true }) });
};

const createPlace = async (req, res, next) => {
  // #swagger.path = '/api/places/'
  // #swagger.tags= ['Places']
  // #swagger.description = 'Create a new place using a provided json'

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalids inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg",
    creator,
  });

  try {
    await createdPlace.save(); //handle all mongoDB code to save and store a document
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating place failed! Please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const patchPlace = async (req, res, next) => {
  // #swagger.path = '/api/places/{pid}'
  // #swagger.tags= ['Places']
  // #swagger.description = 'Update only title and description of a Place'

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalids inputs passed, please check your data.", 422)
    );
  }

  const placeId = req.params.pid;
  const { title, description } = req.body;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong! Could not update place.",
      500
    );
    return next(error);
  }

  if (!patchPlace) {
    throw new HttpError("Could not patch a place for the provided pid.", 404);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong! Could not update place",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  // #swagger.tags= ['Places']
  // #swagger.description = 'Delete a place using place id'
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong! Could not delete place",
      500
    );
    return next(error);
  }

  try {
    await place.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong! Could not delete place",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted place!" });
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  patchPlace,
  deletePlace,
};
