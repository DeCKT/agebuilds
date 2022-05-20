const routes = require("express").Router();

const controller = require("../controllers/builds");

routes.get("/", controller.getAllBuilds);

routes.get("/:id", controller.getBuildById);

// routes.get('/map/:id', controller.getAllBuildsByMap);

// routes.get("/user/:id", controller.getAllBuildsByUser);

routes.post("/", controller.addBuild);

// routes.put("/:id", controller.updateBuild);

// routes.delete("/:id", controller.deleteBuild);

module.exports = routes;
