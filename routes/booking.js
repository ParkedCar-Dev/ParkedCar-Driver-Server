const express = require("express");

const router = express.Router();

const BookingController = require("../controllers/booking");

router.post("/request", BookingController.request);
router.get("/:booking_id", BookingController.getBooking);
router.get("/status/:booking_id", BookingController.getStatus);

module.exports = router;