const express = require("express");

const router = express.Router();

const BookingController = require("../controllers/booking");

router.post("/request", BookingController.request);

module.exports = router;