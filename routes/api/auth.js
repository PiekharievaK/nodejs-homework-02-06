const express = require("express");
const ctrl = require("../../controllers");
const router = express.Router();
const {auth, upload} = require("../../middlewares")

require("dotenv").config();

router.post("/signup", ctrl.auth.signup);

router.post("/login", ctrl.auth.login);

router.get("/logout", auth, ctrl.auth.logout);

router.get("/current", auth , ctrl.auth.current) 

router.patch("/avatars", auth, upload.single("avatar") , ctrl.auth.avatars)

module.exports = router;
