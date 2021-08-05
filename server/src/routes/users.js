var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

import { ErrorHandler } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';

/* GET all users */
router.get('/', async (req, res) => {
  const users = await req.context.models.User.find();
  return res.send(users);
});

/* GET user by id. */
router.get('/:userId', async (req, res) => {
  const user = await req.context.models.User.findById(
    req.params.userId,
  );
  return res.send(user);
});

/* POST users */
router.post('/', async (req, res, next) => {
  const user = await req.context.models.User.create({
    name: req.body.name,
    password: req.body.password,
    isAdmin: req.body.isAdmin,
  }).catch((error) => next(new ErrorHandler(error)));
 
  return res.send(user);
})

/* POST singup users */
router.post('/singup', async (req, res, next) => {
 const user = await req.context.models.User.findOne({ name: req.body.name }, function(err, user) {
    if (err) throw err;
    // test a matching password
    user.comparePassword(req.body.password, function(err, isMatch) {
        if (err) throw err;

        if (isMatch) {
          return user;
        }
    });
  }).catch((error) => next(new ErrorHandler(error)));

 const accessToken = jwt.sign(
    { name: user.name,
      role: user.isAdmin
    }, process.env.TOKEN_SECRET);

  return res.send({user: user, token: accessToken});
})

/* PUT users */
router.put('/', function (req, res) {
  res.send('Got a PUT request at /user')
})

/* DELETE users */
router.delete('/:userId', async (req, res) => {
  const user = await req.context.models.User.findById(
    req.params.userId,
  );

  if (user) {
    await user.remove();
    await req.context.models.Message.deleteMany(
      {participantId: req.params.userId}
    );
  }
  return res.send(user);
})

module.exports = router;
