const Booking = require('../models/booking');
const Space = require('../models/space');
const Utils = require('../utils/utils');
const TimeSlotPrices = require('../models/time_slot_prices');

module.exports = class BookingController {
    static async request(req, res) {
        try{
            const [space_id, from_time, to_time, user_id] = [req.body.space_id, req.body.from_time, req.body.to_time, req.user.user_id]
            if(Utils.checkNullOrUndefined([space_id, from_time, to_time, user_id])){
                return res.json({status: "error", message: "Invalid request.", booking_id: null})
            }
            const isAvailable = await Booking.isTimeAvailable(space_id, from_time, to_time)
            const [isAutoApprove, base_fare] = await Space.checkAutoApproveAndBaseFare(space_id)

            if(!isAvailable){
                return res.json({status: "error", message: "Space is not available for the requested time.", booking_id: null})
            }

            const price = Utils.calculatePrice(from_time, to_time, await TimeSlotPrices.getPrices()) + base_fare
            
            const booking = Booking.buildBooking(space_id, user_id, from_time, to_time, price, isAutoApprove ? "active" : "requested", base_fare)
            await booking.save()

            return res.json({status: "success", message: "Booking request sent.", booking_id: booking.booking_id})
        }catch(err){
            console.error(err.message)
            return res.json({status: "error", message: "Something went wrong.", booking_id: null})
        }
    }

    static async getBooking(req, res){
        try{
            const booking_id = req.body.booking_id
            const booking = await Booking.findOne({where: {booking_id: booking_id}})
            if(!booking){
                return res.json({status: "error", message: "Booking not found.", booking: null})
            }
            if(booking.driver_id != req.user.user_id){
                return res.json({status: "error", message: "You are not authorized to view this booking.", booking: null})
            }
            return res.json({status: "success", message: "Booking found.", booking: booking})
        }catch(err){
            console.error(err.message)
            return res.json({status: "error", message: "Something went wrong.", booking: null})
        }
    }

    static async getStatus(req, res){
        try{
            const booking_id = req.body.booking_id
            const booking = await Booking.findOne({where: {booking_id: booking_id}})
            if(!booking){
                return res.json({status: "error", message: "Booking not found.", status: null})
            }
            if(booking.driver_id != req.user.user_id){
                return res.json({status: "error", message: "You are not authorized to view this booking.", status: null})
            }
            return res.json({status: "success", message: "Booking found.", status: booking.status})
        }catch(err){
            console.error(err.message)
            return res.json({status: "error", message: "Something went wrong.", status: null})
        }
    }

    static async cancelBooking(req, res){
        try{
            const booking_id = req.body.booking_id
            const booking = await Booking.findOne({where: {booking_id: booking_id}})
            if(!booking){
                return res.json({status: "error", message: "Booking not found.", booking: null})
            }
            if(booking.driver_id != req.user.user_id){
                return res.json({status: "error", message: "You are not authorized to cancel this booking.", booking: null})
            }
            if(booking.status != "active" || booking.status != "requested"){
                return res.json({status: "error", message: "Booking cannot be cancelled.", booking: null})
            }
            booking.status = "cancelled"
            await booking.save()
            return res.json({status: "success", message: "Booking cancelled.", booking: booking})
        }catch(err){
            console.error(err.message)
            return res.json({status: "error", message: "Something went wrong.", booking: null})
        }
    }

    static async getPaymentStatus(req, res){
        try{
            const booking_id = req.body.booking_id
            const booking = await Booking.findOne({where: {booking_id: booking_id}})
            if(!booking){
                return res.json({status: "error", message: "Booking not found.", payment_status: null})
            }
            if(booking.driver_id != req.user.user_id){
                return res.json({status: "error", message: "You are not authorized to view this booking.", payment_status: null})
            }
            return res.json({status: "success", message: "Booking found.", payment_status: booking.payment_status})
        }catch(err){
            console.error(err.message)
            return res.json({status: "error", message: "Something went wrong.", payment_status: null})
        }
    }

    static async payFare(req, res){
        try{
            const booking_id = req.body.booking_id
            const booking = await Booking.findOne({where: {booking_id: booking_id}})
            if(!booking){
                return res.json({status: "error", message: "Booking not found."})
            }
            if(booking.driver_id != req.user.user_id){
                return res.json({status: "error", message: "You are not authorized to view this booking."})
            }
            if(booking.payment_status != "unpaid"){
                return res.json({status: "error", message: "Payment already done."})
            }
            booking.payment_status = "paid"
            await booking.save()
            return res.json({status: "success", message: "Payment done."})
        }catch(err){
            console.error(err.message)
            return res.json({status: "error", message: "Something went wrong."})
        }
    }

    static async getDriverBookings(req, res){
        try{
            const status = req.body.status
            let bookings = []
            if(status == 'past'){
                bookings = await Booking.getPastBookings(req.user.user_id)
            } 
            else if(status == 'current'){
                bookings = await Booking.getCurrentBookings(req.user.user_id)
            } 
            else {
                bookings = await Booking.getBookingsByStatus(status, req.user.user_id)
            }
            return res.json({status: "success", message: "Bookings found.", bookings: bookings})
        }catch(err){
            console.error(err.message)
            return res.json({status: "error", message: "Something went wrong.", bookings: null})
        }
    }

    static async rateSpace(req, res){
        try{
            const [booking_id, rating] = [req.body.booking_id, req.body.rating]
            if(Utils.checkNullOrUndefined([booking_id, rating])){
                return res.json({status: "error", message: "Invalid request."})
            }
            const booking = await Booking.findOne({where: {booking_id: booking_id}})
            if(!booking){
                return res.json({status: "error", message: "Booking not found."})
            }
            if(booking.driver_id != req.user.user_id){
                return res.json({status: "error", message: "You are not authorized to review this booking."})
            }
            if(booking.status != "completed"){
                return res.json({status: "error", message: "Booking is not completed."})
            }
            const space = await Space.findOne({where: {space_id: booking.space_id}})
            if(!space){
                return res.json({status: "error", message: "Space not found."})
            }
            const [oldRating, oldCount] = [space.rating, space.no_ratings]
            space.rating = (oldRating * oldCount + rating) / (oldCount + 1)
            space.no_ratings = oldCount + 1
            await space.save()
            return res.json({status: "success", message: "Space reviewed."})
        }catch(err){
            console.error(err.message)
            return res.json({status: "error", message: "Something went wrong."})
        }
    }
}