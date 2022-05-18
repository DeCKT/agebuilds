const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllBuilds = async (req, res, next) => {
  const result = await mongodb.getDb().db().collection("build-orders").find();
  result.toArray().then((builds) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(builds);
    next();
  });
};

const getBuildById = async (req, res, next) => {
  const buildId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .db()
    .collection("build-orders")
    .find({ _id: buildId });
  result.toArray().then((builds) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(builds[0]);
    next();
  });
};

module.exports = { getAllBuilds, getBuildById };
