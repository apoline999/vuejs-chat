import mongoose from 'mongoose';
 
import User from './user';
import Message from './message';
 
const connectDb = () => {
  return mongoose.connect(
    process.env.DATABASE_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  );
};
const models = { Message, User };
 
export { connectDb };
 
export default models;
