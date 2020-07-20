const router = require('express').Router();
const bcrypt = require('bcryptjs');
const userLogins = require('../models/UserLogin.model');
const users = require('../models/User.model');

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await users.findOne({ username: username });
    if (user) {
      res.status(409).json({ err: 'UEXIST' });
      return;
    }
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return res.status(500).json({ err: 'Error Generating salt' });
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return res.status(500).json({ err: 'Error in hashing' });
        const user = new userLogins({ username, password: hash });
        try {
          await user.save();
          const userdata = new users({ username });
          await userdata.save();
        } catch (err) {
          return res.status(400).json({ err: 'Error Registering User' });
        }
        return res.status(200).json({ msg: 'Registered Successfully' });
      });
    });
  } catch (err) {
    return res.status(400).json({ err: 'Error Creating Room.' });
  }
});
module.exports = router;
