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
            const booking_id = req.params.booking_id
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
            const booking_id = req.params.booking_id
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
}