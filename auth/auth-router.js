const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); //******* */
const secret = require("../api/secrets.js").jwtSecret; //<<<<<<

const Users = require("../users/users-model.js");

// for endpoints beginning with /api/auth
router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      //token goes here- pass user to payload
      const token = generateToken(user); //******** */
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token //****** */
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//generateToken function
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    roles: ["admin", "ta"] //pretend they come from database user.roles, if thats the case and i log in now, tokens we already produce they dont have the roles, if we want to get token that has the roles we need to log in again. that'd mean on this side in restrictied middleware, the decoded jwt wil have those roles. s
  };
  //removed const secret from this line
  const options = {
    expiresIn: "1d" //docs for json token
  };
  return jwt.sign(payload, secret, options); //returns valid token
}

module.exports = router;
