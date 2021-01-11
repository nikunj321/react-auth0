const express = require("express");
const jwt = require("express-jwt"); // validate JWT and set req.user
const jwksRsa = require("jwks-rsa"); // Retrieve RSA key set form a JSON Web Key set(JWSK) endpoint
const checkScope = require("express-jwt-authz"); // validate JWT scopes
require("dotenv").config();

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header
  // and signing the key provided by JWSK endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true, // cache the signing signature
    rateLimit: true,
    jwksRequestsPerMinute: 5, // preventing attackers form prventing more than 5 req per minute
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  // validate audience and issuer
  audience: process.env.REACT_APP_AUTH0_AUDIENCE, // https://localhost:3001
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

  algorithms: ["RS256"],
});

const app = express();

app.get("/public", function (req, res) {
  res.json({
    message: "hello from public API.",
  });
});

app.get("/private", checkJwt, function (req, res) {
  res.json({
    message: "hello from private API.",
  });
});

app.get("/course", checkJwt, checkScope(["read:courses"]), function (req, res) {
  res.json({
    courses: [
      { id: 1, title: "Building app with react and redux" },
      { id: 2, title: "Creating reusable react component" },
    ],
  });
});

function checkRole(role) {
    return function(req, res, next) {
        const assignRoles = req.user["http:localhost:3000/roles"];
        if(Array.isArray(assignRoles) && assignRoles.includes(role)) {
            return next();
        } else {
            return res.status(401).send("Insufficient role");
        }
    };
}

app.get("/admin", checkJwt, checkRole("admin"), function (req, res) {
  res.json({
    message: "hello from admin API.",
  });
});

app.listen(3001);

console.log("API server listening on " + process.env.REACT_APP_API_URL);
