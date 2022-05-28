const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllBuilds = async (req, res, next) => {
  try {
    const result = await mongodb.getDb().db().collection("build-orders").find();
    result.toArray().then((builds) => {
      if (builds.length === 0) {
        res.status(404).json("Unable to find any builds");
      } else {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(builds);
        next();
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
// help
const getBuildById = async (req, res, next) => {
  try {
    const buildId = new ObjectId(req.params.id);
    if (!req.params.id) {
      res.status(400).json("Build ID is required.");
    } else {
      const result = await mongodb
        .getDb()
        .db()
        .collection("build-orders")
        .find({ _id: buildId });
      result.toArray().then((builds) => {
        if (builds.length === 0) {
          res.status(404).json("Unable to find build with that ID.");
        } else {
          res.setHeader("Content-Type", "application/json");
          res.status(200).json(builds[0]);
          next();
        }
      });
    }
  } catch (err) {
    res.status(500).json(err.message || "Unable to find any builds.");
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
      res.status(400).json("Missing content in one or more required fields.");
    } else {
      const result = await mongodb
        .getDb()
        .db()
        .collection("build-orders")
        .insertOne(build);
      if (result.acknowledged) {
        res.status(201).json(result);
        next();
      } else {
        res.status(400).json("A problem occurred when trying to add build.");
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateBuild = async (req, res, next) => {
  try {
    const buildId = new ObjectId(req.params.id);
    if (!req.params.id) {
      res.status(400).json("Build ID is required.");
    } else {
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
        res.status(400).json("A problem occurred when trying to update build.");
      }
    }
  } catch (err) {
    res.staus(500).json(err);
  }
};

const deleteBuildById = async (req, res, next) => {
  try {
    const buildId = new ObjectId(req.params.id);
    if (!req.params.id) {
      res.status(400).json("Build ID is required.");
    } else {
      const result = await mongodb
        .getDb()
        .db()
        .collection("build-orders")
        .deleteOne({ _id: buildId });
      if (result.acknowledged) {
        res.status(200).json(result);
        next();
      } else {
        res.status(400).json("A problem occurred when trying to delete build.");
      }
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
