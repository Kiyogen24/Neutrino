const {
  register,
  login,
  getAllUsers,
  getAllGroups,
  /*removeMemberFromGroup,
  addMemberToGroup,*/
  createGroup,
  logOut,
} = require("../controllers/userController");

const router = require("express").Router();


router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.get("/allgroups/:id", getAllGroups);
/*
router.get("/addmembertogroup/:id", addMemberToGroup);
router.get("/removememberfromgroup/:id", removeMemberFromGroup);
*/
router.get("/creategroup/:id", createGroup);
router.get("/logout/:id", logOut);


module.exports = router;
