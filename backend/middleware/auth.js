const jwt = require("jsonwebtoken");
const config = require("config");

const auth = (req, res, next) => {
  const token = req.header("milaap-auth-token");
  // console.log(token)
  // Check for token
  // console.log("Inside user middleware", token);
  if (!token) return res.status(401).json({ msg: "JWT Not Found" });

  try {
    // Verify token
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    // Add user from payload
    // console.log(decoded)
    req.user = decoded.user;

    next();
  } catch (e) {
    console.log("token not valid : ", token);
    res.status(400).json({ msg: "Token is not valid" });
  }
};

module.exports = auth;
