const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./db/connect");
const { requiresAuth } = require("express-openid-connect");

// TODO: Add routes here
const buildOrders = require("./routes/builds");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();
const port = process.env.PORT || 3000;

const { auth } = require("express-openid-connect");

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  })
  .use("/builds", buildOrders)
  .use("/profile", requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  })
  // .use("/users", users)
  .use(
    "/api-docs",
    requiresAuth(),
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on port ${port}`);
  }
});
