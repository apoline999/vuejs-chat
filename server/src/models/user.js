import mongoose from 'mongoose';

var Schema = mongoose.Schema,
  bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10;
 
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    password: {
      type: String,
      required: true
    },
    // TODO: Nested messages
    // Messages shall be grouped by User Object
    // with an Object Message into it
    // messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
  },
  { timestamps: true },

);

userSchema.statics.findByLogin = async function (login) {
  let user = await this.findOne({
    name: login,
  });
 
  if (!user) {
    user = await this.findOne({ email: login });
  }
 
  return user;
};

// hashing the password before saving new user
userSchema.pre('save', function (next) { 
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
  });
});

userSchema.pre('remove', function(next) {
  this.model('Message').deleteMany({ user: this._id }, next);
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return callback(err);
      callback(null, isMatch);
  });
};

const User = mongoose.model('User', userSchema);
 
export default User;
