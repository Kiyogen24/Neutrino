const mongoose = require('mongoose');

// Define the schema for group messages
const groupMessageSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group', // Reference to the Group model
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', // Reference to the User model
    required: true
  },
  message: {
    text: { type: String, required: true },
  },
},
  {
  timestamps: true
  }
);

// Create the Mongoose model for group messages
const GroupMessage = mongoose.model('GroupMessage', groupMessageSchema);

module.exports = GroupMessage;
