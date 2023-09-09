const express = require("express");

const router = express.Router();

const BookingController = require("../controllers/booking");

router.post("/request", BookingController.request);
router.post("/getBooking", BookingController.getBooking);
router.post("/status", BookingController.getStatus);
router.post("/cancel", BookingController.cancelBooking);

module.exports = router;