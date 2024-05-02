const { addMessage, getMessages, getLastMessage } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/lastmsg/", getLastMessage);

module.exports = router;
