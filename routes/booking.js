const express = require("express");

const router = express.Router();

const BookingController = require("../controllers/booking");

router.post("/request", BookingController.request);
router.post("/getBooking", BookingController.getBooking);
router.post("/status", BookingController.getStatus);
router.post("/cancel", BookingController.cancelBooking);
router.post("/paymentStatus", BookingController.getPaymentStatus);
router.post("/payFare", BookingController.payFare);
router.post("/getDriverBookings", BookingController.getDriverBookings);
router.post("/rateSpace", BookingController.rateSpace);

module.exports = router;