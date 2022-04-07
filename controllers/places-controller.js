const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require('uuid');
const { v4 } = require("uuid");

const DUMMY_PLACES = [
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

const getPlaceByUserId = (req, res, next) => {
  // #swagger.tags= ['Places']
  // #swagger.description = 'Find a place using a provided user id'
  const userId = req.params.uid;

  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
  }

  res.json({ place });
};

const createPlace = (req, res, next) => {
  // #swagger.tags= ['Places']
  // #swagger.description = 'Create a new place using a provided json'
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
  res.status(201).json({place: createdPlace});
};

module.exports = {
  getPlaceById,
  getPlaceByUserId,
  createPlace,
};
