const { sendMessageToGroup, getGroupMessages } = require("../controllers/groupMessageController");
const router = require("express").Router();

router.post("/addgrpmsg/", sendMessageToGroup);
router.post("/getgrpmsg/", getGroupMessages);

module.exports = router;
