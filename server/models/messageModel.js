const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    /*
    iv: {
      type: Array,
      required: true
    },
    ciphertext: {
      type: Array,
      required: true
    },*/
    
    message: {
      text: { type: String, required: true },
    },
    cpy: {
      text: { type: String, required: true },
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, required: true }, 
    seen: { type: Boolean, default: false},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", MessageSchema);
