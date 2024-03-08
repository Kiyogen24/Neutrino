const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: {
    type: Array,
    ref: 'Users', // Reference to the Users model
    required: true,
  },
},
{
    timestamps: true,
},
  );

module.exports = mongoose.model("Group", groupSchema);

