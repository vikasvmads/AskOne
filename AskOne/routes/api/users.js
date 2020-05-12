const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const userController = require("../../controllers/userController");


const User = require("../../models/User");

router.post("/register/", userController.register);

router.post("/login/", userController.login);

router.get("/getUserById/:id", userController.getUserById)

module.exports = router;