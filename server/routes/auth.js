const {
  register,
  login,
  getAllUsers,
  setAvatar,
  getAllGroups,
  getGroupMembers,
  /*removeMemberFromGroup,
  addMemberToGroup,*/
  createGroup,
  logOut,
} = require("../controllers/userController");

const router = require("express").Router();


router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.get("/allgroups/:id", getAllGroups);
router.post("/getgrpmbrs", getGroupMembers);
/*
router.get("/addmembertogroup/:id", addMemberToGroup);
router.get("/removememberfromgroup/:id", removeMemberFromGroup);
*/
router.post("/creategroup", createGroup);
router.get("/logout/:id", logOut);


module.exports = router;
