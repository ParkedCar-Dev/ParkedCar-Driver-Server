const express = require("express");

const router = express.Router();

const RegisterController = require("../controllers/register");

router.post("/", RegisterController.register);

module.exports = router;