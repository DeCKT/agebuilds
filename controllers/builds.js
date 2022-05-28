const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllBuilds = async (req, res, next) => {
  try {
    const result = await mongodb.getDb().db().collection("build-orders").find();
    result.toArray().then((builds) => {
      if (builds.length === 0) {
        throw new Error(err);
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(builds);
      next();
    });
  } catch (err) {
    res.status(500).json("An error occurred while attempting to get builds.");
  }
};

const getBuildById = async (req, res, next) => {
  try {
    const buildId = new ObjectId(req.params.id);
    if (!req.params.id) {
      throw new Error("Build ID is required.", { status: 400 });
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
    res.status(err.status).json(err.message);
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
    if (
      !req.body.game ||
      !req.body.gameVersion ||
      !req.body.buildName ||
      !req.body.civilizations ||
      !req.body.maps ||
      !req.body.postedBy ||
      !req.body.postedDate ||
      !req.body.steps
    ) {
      throw new Error("Missing info from required fields.", { status: 400 });
    }
    const result = await mongodb
      .getDb()
      .db()
      .collection("build-orders")
      .insertOne(build);
    if (result.acknowledged) {
      res.status(201).json(result);
      next();
    } else {
      throw new Error(
        "Some error occurred while attempting to create new build",
        { status: 400 }
      );
    }
  } catch (err) {
    res.status(err.status).json(err.message);
  }
};

const updateBuild = async (req, res, next) => {
  try {
    const buildId = new ObjectId(req.params.id);
    if (!req.params.id) {
      throw Error("Build ID is required", { status: 400 });
    }
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
      throw new Error(
        result.error || "Some error occurred while attempting to update build.",
        { status: 400 }
      );
    }
  } catch (err) {
    res.staus(err.status).json(err.message);
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
      throw new Error(
        result.error || "Some error occured while attempting to delete build.",
        { status: 400 }
      );
    }
  } catch (err) {
    res.status(err.status).json(err.message);
  }
};

module.exports = {
  getAllBuilds,
  getBuildById,
  addBuild,
  updateBuild,
  deleteBuildById,
};
