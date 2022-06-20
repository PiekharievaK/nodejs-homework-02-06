const express = require("express");
const ctrl = require("../../controllers");
const auth = require("../../middlewares/auth")

const router = express.Router();

router.get("/", auth,  ctrl.contacts.getAll);

router.get("/:contactId", ctrl.contacts.getContactById);

router.post("/", auth, ctrl.contacts.addNewContact);

router.put("/:contactId", ctrl.contacts.updateContact);

router.delete("/:contactId", ctrl.contacts.deleteContact);

router.patch("/:contactId/favorite", ctrl.contacts.updateStatusContact);

module.exports = router;
