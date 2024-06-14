const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  surname: {
    type: String,
    required: true,
    unique: false,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  avatarImage: {
    type: String,
    required: true,
  },
  publicKey: {
    type: String,
    required: true,
  },
  prK: {
    type: String,
    required: true,
  },
  iv: {
    type: String,
    required: true,
  },
  
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);