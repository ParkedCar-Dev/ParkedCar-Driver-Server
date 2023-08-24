const Booking = require('../models/booking');
const Space = require('../models/space');
const Utils = require('../utils/utils');

module.exports = class BookingController {
    static async request(req, res) {
        try{
            const [space_id, from_time, to_time, price, user_id] = [req.body.space_id, req.body.from_time, req.body.to_time, req.body.price, req.user.user_id]
            if(Utils.checkNullOrUndefined([space_id, from_time, to_time, price, user_id])){
                return res.json({status: "error", message: "Invalid request."})
            }
            const isAvailable = await Booking.isTimeAvailable(space_id, from_time, to_time)
            const isAutoApprove = await Space.isAutoApprove(space_id)

            if(!isAvailable){
                return res.json({status: "error", message: "Space is not available for the requested time."})
            }
            
            const booking = Booking.buildBooking(space_id, user_id, from_time, to_time, price, isAutoApprove ? "active" : "requested")
            await booking.save()

            return res.json({status: "success", message: "Booking request sent."})
        }catch(err){
            console.error(err.message)
            return res.json({status: "error", message: "Something went wrong."})
        }
    }


}