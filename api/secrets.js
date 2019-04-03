//this is going to equal to an object, the jwt secret
module.exports = {
  jwtSecret: process.env.JWT_SECRET || "keep it secret, keep it safe"
};
