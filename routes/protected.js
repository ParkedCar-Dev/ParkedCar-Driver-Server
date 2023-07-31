const express = require("express");

const router = express.Router();

const protectedController = require("../controllers/protected");

router.get("/", protectedController.protected);

module.exports = router;