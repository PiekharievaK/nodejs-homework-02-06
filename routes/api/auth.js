const express = require("express");
const ctrl = require("../../controllers");


const router = express.Router();
const auth = require("../../middlewares/auth")


require("dotenv").config();
router.post("/signup", ctrl.auth.signup);

router.post("/login", ctrl.auth.login);

router.get("/logout", auth, ctrl.auth.logout);

router.get("/current", auth , ctrl.auth.current) 

module.exports = router;
