import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import models, { connectDb } from './models';
import routes from './routes';

const app = express();

// add CORS HTTP header to every request by default
app.use(cors());

// Middleware to convert data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom MiddleWare to set data
app.use(async (req, res, next) => {
	req.context = {
		models,
		me: await models.User.findByLogin('rwieruch'),
	};
	next();
});

// Routes setting
// app.use('/session', routes.session);
app.use('/users', routes.user);
app.use('/messages', routes.message);

// Express error middleware
app.get('*', function (req, res, next) {
  const error = new Error(
    `${req.ip} tried to access ${req.originalUrl}`,
  );
 
  error.statusCode = 301;
 
  next(error);
});
// No status code will redirect to a 500
// Or redirect to a 404
app.use((error, req, res, next) => {
  if (!error.statusCode) error.statusCode = 500;
 
  if (error.statusCode === 301) {
    return res.status(301).redirect('/not-found');
  }
 
  return res
    .status(error.statusCode)
    .json({ error: error.toString() });
});

const eraseDatabaseOnSync = true;
connectDb().then(async () => {
	if (eraseDatabaseOnSync) {
		await Promise.all([
			models.User.deleteMany({}),
			models.Message.deleteMany({}),
		]);

		createUsersWithMessages();
	}

	var server = app.listen(process.env.PORT, () =>
		console.log(`Example app listening on port ${process.env.PORT}!`),
		);

  var io = require('socket.io')(server, {
    cors: {
      origin: "http://localhost:8080",
      allowedHeaders: ["*"],
    }
  });

  console.log('io.sockets', io.sockets.sockets);

  io.on('connection', function(socket) {
    // when the admin is sending a message
    // save it on databse by using model
    // and callback the front-end to get it back
    socket.on('SEND_MESSAGE', function(data) {
      console.log('SEND_MESSAGE', data);
      io.emit('MESSAGE', data)
    });
  });
});
const createUsersWithMessages = async () => {
  const user1 = new models.User({
    name: 'sam',
    password: 'pwd'
  });
  const user2 = new models.User({
    name: 'david',
    isAdmin: true,
    password: 'pwd'
  });

	const message1 = new models.Message({
    content: 'Published the Road to learn React',
    participantId: user1.id,
    toUserId: user2.id,
    type: 'text',
  });
  const message2 = new models.Message({
    content: 'Happy to release ...',
    participantId: user2.id,
    toUserId: user1.id,
    type: 'text',
  });
 
  const message3 = new models.Message({
    content: 'Published a complete ...',
    participantId: user2.id,
    toUserId: user1.id,
    type: 'text',
  });

  await user1.save();
  await user2.save();
 
  await message1.save(); 
  await message2.save();
  await message3.save();

};
