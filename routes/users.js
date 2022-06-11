const routes = require("express").Router();

const controller = require("../controllers/users");

// routes.get("/", controller.getAllUsers)

routes.get("/:id", controller.getUserById);

// routes.post("/", controller.addUser);

// routes.put("/:id", controller.updateUserById);

routes.delete("/:id", controller.deleteUserById);

module.exports = routes;
