const {
  register,
<<<<<<< HEAD
  
=======
  login
>>>>>>> d1a7133 (Update on frontend)
} = require("../controllers/userController");

const router = require("express").Router();


<<<<<<< HEAD
router.post("/register", register)
=======
router.post("/register", register);
router.post("/login", login);

>>>>>>> d1a7133 (Update on frontend)


module.exports = router;
