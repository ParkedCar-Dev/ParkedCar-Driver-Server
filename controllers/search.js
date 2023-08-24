const Utils = require('../utils/utils');
const Space = require('../models/space');
const Booking = require('../models/booking');
const db = require('../models/index');

module.exports = class SearchController{
    static async quickSearch(req, res){
        const default_distance = parseInt(process.env.DEFAULT_DISTANCE);
        try{
            const [latitude, longitude, city] = [req.body.latitude, req.body.longitude, req.body.city];
            if (!latitude || !longitude || !city){
                return res.json({status: "error", message: "Invalid form submission.", spaces: null})
            }
            const from = Date.now();
            const to = from + 3600000;

            const spaces = await Space.findAvailableSpaces(city, latitude, longitude, from, to, default_distance, false, false, false, false);

            const time_slot_prices = await db.time_slot_price.findAll({
                attributes: ['additional_price'],
            })
            
            const additional_price = Utils.calculatePrice(from, to, time_slot_prices);

            const prices = spaces.map(space => {
                return space.base_fare + additional_price;
            })

            var result = Space.makeResult(spaces, prices);

            res.json({status: "success", message: "Quick search successful.", spaces: result})

        }catch(err){
            console.error(err)
            res.json({status: "error", message: "Something went wrong.", spaces: null})
        }
    }

    static async advancedSearch(req, res){
        const [latitude, longitude, city, from, to, distance, security_measures, auto_approve, price] = [req.body.latitude, req.body.longitude, req.body.city, req.body.from, req.body.to, req.body.distance, req.body.security_measures, req.body.auto_approve, req.body.price];
        try{
            if (Utils.checkNullOrUndefined([latitude, longitude, city, from, to, distance, security_measures, auto_approve, price])){
                return res.json({status: "error", message: "Invalid form submission.", spaces: null})
            }
            const [guard, indoor, cc] = [security_measures.includes("guard"), security_measures.includes("indoor"), security_measures.includes("cc") || security_measures.includes("cctv")];
            const spaces = await Space.findAvailableSpaces(city, latitude, longitude, from, to, distance, guard, indoor, cc, auto_approve);
            const time_slot_prices = await db.time_slot_price.findAll({
                attributes: ['additional_price'],
            })

            const additional_price = Utils.calculatePrice(from, to, time_slot_prices);

            const prices = spaces.map(space => {
                return space.base_fare + additional_price;
            })

            var result = Space.makeResult(spaces, prices);

            result = Space.filterByPrice(result, price);

            res.json({status: "success", message: "Advanced search successful.", spaces: result})

        }catch(err){
            console.error(err)
            res.json({status: "error", message: "Something went wrong.", spaces: null})
        }

    } 
}