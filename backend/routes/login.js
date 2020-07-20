const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const userLogins = require('../models/UserLogin.model');

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userLogins.findOne({ username });
    if (!user) return res.status(400).json({ err: 'Invalid Credentials' });
    bcrypt.compare(password, user.password, (lerr, result) => {
      if (!result) {
        console.log(lerr);
        return res.status(400).json({ err: 'Invalid Credentials' });
      }
      const payload = {
        user: {
          id: user.username
        }
      };
      try {
        jwt.sign(
          payload,
          config.get('jwtSecret'),
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              token,
              user_details: {
                userId: user.username
              }
            });
          }
        );
      } catch (e) {
        res.status(400).json({ err: e });
      }
    });
  } catch (err) {
    res.status(400).json({ err: 'Invalid Credentials' });
  }
});
module.exports = router;
