const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getUserById = async (req, res, next) => {
  try {
    const userId = new ObjectId(req.params.id);
    if (!req.params.id) {
      res.status(400).json("User ID is required.");
    } else {
      const result = await mongodb
        .getDb()
        .db()
        .collection("users")
        .find({ _id: userId });
      result.toArray().then((users) => {
        if (users.length === 0) {
          res.status(404).json("Unable to find user with that ID.");
        } else {
          res.setHeader("Content-Type", "application/json");
          res.status(200).json(users[0]);
          next();
        }
      });
    }
  } catch (err) {
    res.status(500).json(err.message || "Unable to find any users.");
  }
};

// const addUser = (req, res, next) => {
//     try {
//         const user = {

//         }
//     }
// };

// const updateUserById = () => {};

const deleteUserById = async (req, res, next) => {
  try {
    const userId = new ObjectId(req.params.id);
    if (!req.params.id) {
      res.status(400).json("User ID is required.");
    } else {
      const result = await mongodb
        .getDb()
        .db()
        .collection("users")
        .deleteOne({ _id: userId });
      if (result.acknowledged && result.deletedCount > 0) {
        res.status(200).json(result);
        next();
      } else {
        res.status(400).json("A problem occurred when trying to delete user.");
      }
    }
  } catch (err) {
    res.status(err.status).json(err.message);
  }
};

module.exports = {
  getUserById,
  deleteUserById,
};
