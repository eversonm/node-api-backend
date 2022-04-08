const { v4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire state building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9878584,
    },
    address: "20 W 34th St, New York, NY 10001, Estados Unidos",
    creator: "u1",
  },
];

const getPlaceById = (req, res, next) => {
  // #swagger.path = '/api/places/{pid}'
  // #swagger.tags= ['Places']
  // #swagger.description = 'Find a place using Id'
  const placeId = req.params.pid;

  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }

  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  // #swagger.path = '/api/places/user/{uid}'
  // #swagger.tags= ['Places']
  // #swagger.description = 'Find a place using a provided user id'
  const userId = req.params.uid;

  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId;
  });

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }

  res.json({ places });
};

const createPlace = (req, res, next) => {
  // #swagger.path = '/api/places/'
  // #swagger.tags= ['Places']
  // #swagger.description = 'Create a new place using a provided json'

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("Invalids inputs passed, please check your data.", 422);
  }

  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: v4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace });
};

const patchPlace = (req, res, next) => {
  // #swagger.path = '/api/places/{pid}'
  // #swagger.tags= ['Places']
  // #swagger.description = 'Update only title and description of a Place'

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("Invalids inputs passed, please check your data.", 422);
  }

  const placeId = req.params.pid;

  const { title, description } = req.body;

  const patchedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

  if (!patchPlace) {
    throw new HttpError("Could not patch a place for the provided pid.", 404);
  }

  patchedPlace.title = title;
  patchedPlace.description = description;

  DUMMY_PLACES[placeIndex] = patchedPlace;

  res.status(200).json({ patchedPlace });
};

const deletePlace = (req, res, next) => {
  // #swagger.path = '/api/places/{pid}'
  // #swagger.tags= ['Places']
  // #swagger.description = 'Delete a place using place id'
  const placeId = req.params.pid;
  
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("Could not find a place for that id.", 404);
  }

  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  res.status(200).json({ message: "Deleted place!" });
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  patchPlace,
  deletePlace,
};
