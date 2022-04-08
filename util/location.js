const axios = require("axios");

const API_KEY = require("../config-key"); //get your api key from google geocoding
const HttpError = require("../models/http-error");

const getCoordsForAddress = async (address) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${API_KEY}`;
  const response = await axios.get(url);

  const data = response.data;

  if (!data || data.status === "ZERO_RESULT") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
};

module.exports = getCoordsForAddress;
