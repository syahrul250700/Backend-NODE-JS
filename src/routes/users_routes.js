const express = require("express");

const UsersController = require("../controllers/users_controller.js");

const router = express.Router();
//GET ALL USERS
router.get("/", UsersController.getAllUser);
//POST ADD USERS
router.post("/", UsersController.AddNewUser);
// PUT UPDATE USERS
router.patch("/:idUser", UsersController.UpdateUser);
//DELETE USER
router.delete("/:idUser", UsersController.DeleteUser);
//POST LOGIN
router.post("/login", UsersController.loginUser);

module.exports = router;
