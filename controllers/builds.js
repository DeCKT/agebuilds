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

const addBuild = async (req, res, next) => {
  const build = {
    game: req.body.game,
    gameVersion: req.body.gameVersion,
    buildName: req.body.buildName,
    civilizations: req.body.civilizations,
    maps: req.body.maps,
    postedBy: req.body.postedBy,
    postedDate: req.body.postedDate,
    steps: req.body.steps,
    videoExample: req.body.videoExample,
  };
  const result = await mongodb
    .getDb()
    .db()
    .collection("build-orders")
    .insertOne(build);
  if (result.acknowledged) {
    res.status(201).json(result);
    next();
  } else {
    res
      .status(500)
      .json(
        result.error ||
          "Some error occurred while attempting to create new build."
      );
  }
};

module.exports = { getAllBuilds, getBuildById };
