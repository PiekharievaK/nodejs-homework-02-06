const express = require("express");
const ctrl = require("../../controllers");
const router = express.Router();
const { auth, upload } = require("../../middlewares");

require("dotenv").config();

router.post("/signup", ctrl.auth.signup);

router.post("/login", ctrl.auth.login);

router.get("/logout", auth, ctrl.auth.logout);

router.get("/current", auth, ctrl.auth.current);

router.patch("/avatars", auth, upload.single("avatar"), ctrl.auth.avatars);

router.get("/verify/:verificationToken", ctrl.auth.verify);

router.post("/verify", ctrl.auth.resendVerify);

module.exports = router;
