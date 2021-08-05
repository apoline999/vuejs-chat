var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');

import { ErrorHandler } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';

// An admin need to be authenticated
// Getting the list of all current chat
// TODO: add an array of messages oject to the user model
router.get('/', authenticateToken, async (req, res) => {
  const message = await req.context.models.Message.find();
	return res.send(message);
});

// get all the messages sended and received by the userId
router.get('/:userId', async (req, res) => {
	const message = await req.context.models.Message.find({participantId: req.params.userId});
	return res.send(message);
});

// send a message
// TODO: add the from user
router.post('/', async (req, res, next) => {
  const message = await req.context.models.Message.create({
    content: req.body.content,
    participantId: req.body.participantId,
    type: 'text',
  }).catch((error) => next(new ErrorHandler(error)));
 
  return res.send(message);
});

// remove a specific message
router.delete('/:messageId', async (req, res) => {
	const message = await req.context.models.Message.findById(
		req.params.messageId,
		);

	if (message) {
		await message.remove();
	}

	return res.send(message);
});

// use a JWT for message sended by an admin
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

module.exports = router;