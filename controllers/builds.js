const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllBuilds = async (req, res, next) => {
  try {
    const result = await mongodb.getDb().db().collection("build-orders").find();
    result.toArray().then((builds) => {
      if (builds.length == 0) {
        res.status(404).json("Unable to find any builds.");
        throw err;
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(builds);
      next();
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

const getBuildById = async (req, res, next) => {
  try {
    const buildId = new ObjectId(req.params.id);
    if (!req.params.id) {
      throw err;
    }
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
  } catch (err) {
    res.status(400).json(err);
  }
};

const addBuild = async (req, res, next) => {
  try {
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
  } catch (err) {
    res.status(400).json(err);
  }
};

const updateBuild = async (req, res, next) => {
  try {
    const buildId = new ObjectId(req.params.id);
    console.log("Hello?");
    const result = await mongodb
      .getDb()
      .db()
      .collection("build-orders")
      .updateOne(
        { _id: buildId },
        {
          $set: {
            game: req.body.game,
            gameVersion: req.body.gameVersion,
            buildName: req.body.buildName,
            civilizations: req.body.civilizations,
            maps: req.body.maps,
            postedBy: req.body.postedBy,
            postedDate: req.body.postedDate,
            steps: req.body.steps,
            videoExample: req.body.videoExample,
          },
        }
      );
    if (result.acknowledged) {
      res.status(200).json(result);
      next();
    } else {
      res
        .status(500)
        .json(
          result.error || "Some error occured while attempting to update build."
        );
    }
  } catch (err) {
    res.staus(400).json(err);
  }
};

const deleteBuildById = async (req, res, next) => {
  try {
    const buildId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection("build-orders")
      .deleteOne({ _id: buildId });
    if (result.acknowledge) {
      res.status(200).json(result);
      next();
    } else {
      res
        .status(500)
        .json(
          result.error || "Some error occured while attempting to delete build."
        );
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  getAllBuilds,
  getBuildById,
  addBuild,
  updateBuild,
  deleteBuildById,
};
