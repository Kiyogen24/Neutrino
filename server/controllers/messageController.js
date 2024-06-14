const Messages = require("../models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        //message: {iv: msg.iv,ciphertext:msg.ciphertext},
        message: msg.message.text,
        cpy: msg.cpy.text,
        sentAt: msg.createdAt,
        type: msg.type,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.getLastMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const message = await Messages.findOne({
      users: {
        $all: [from, to],
      },
    }).sort({ createdAt: -1 });

    if (!message) {
      return res.status(404).json({ msg: "No messages found" });
    }

    let messageType = message.type;
    if (messageType === 'picture') {
      messageType = 'Image';
      message.message = 'Image';
    }

    const projectedMessage = {
      fromSelf: message.sender.toString() === from,
      //message: {iv: message.iv, ciphertext:message.ciphertext},
      message: message.message.text,
      cpy: message.cpy.text,
      sentAt: message.createdAt,
      type: message.type,
    };

    res.json(projectedMessage);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message, cpy, type } = req.body;
    const data = await Messages.create({
      //iv: message.iv,
      //ciphertext: message.ciphertext,
      message: {text: message},
      cpy: {text : cpy},
      users: [from, to],
      sender: from,
      type: type,
      
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};
