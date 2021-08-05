import mongoose from 'mongoose';
 
const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    participantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // TODO: chatId
    // message can be send by any admin to an user
    // that create a conversation ID
  },
  { timestamps: true },
);

const Message = mongoose.model('Message', messageSchema);
 
export default Message;
