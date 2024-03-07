const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: {
    type: Array,
    ref: 'Users', // Reference to the Users model
    required: true,
  },
},
  );

module.exports = mongoose.model("Group", groupSchema);

