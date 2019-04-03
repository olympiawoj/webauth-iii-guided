const router = require("express").Router();

const Users = require("./users-model.js");
const restricted = require("../auth/restricted-middleware.js");

router.get("/", restricted, withRole("admin"), (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

//always used after users logged in and we have the token
function withRole(role) {
  return function(req, res, next) {
    if (
      req.decodedJwt &&
      req.decodedJwt.roles &&
      req.decodedJwt.roles.includes(role)
    ) {
      next();
    } else {
      res.status(403).json({ message: "you sir have no power here" });
    }
  };
}

module.exports = router;
