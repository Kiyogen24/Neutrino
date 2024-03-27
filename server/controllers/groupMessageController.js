const GroupMessage = require("../models/groupMessageModel");
const User = require("../models/userModel");

module.exports.sendMessageToGroup = async (req, res, next) => {
  try {
    const { groupId, senderId, message } = req.body;
    const data = await GroupMessage.create({
      groupId: groupId,
      senderId: senderId,
      message: { text: message },
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }

};

module.exports.getGroupMessages = async (req, res, next) => {
  try {
    const { groupId, userId } = req.body;

    // Retrieve all messages for the given group
    const groupMessages = await GroupMessage.find({ groupId }).sort({ updatedAt: 1 });

    const projectedGroupMessages = await Promise.all(groupMessages.map(async (msg) => {
      // Retrieve the user who sent the message
      const user = await User.findById(msg.senderId);
      return {
        fromSelf: msg.senderId.toString() === userId,
        fromUser: user ? user.surname : '', // Add the username to the response
        message: msg.message.text,
        sentAt: msg.createdAt,
      };
    }));
    res.json(projectedGroupMessages);
  } catch (ex) {
    next(ex);
  }
};

// Add more controller methods as needed
