const Utils = require('../utils/utils');
const Space = require('../models/space');
const TimeSlotPrice = require('../models/time_slot_prices');


module.exports = class SearchController{
    static async quickSearch(req, res){
       try{
            const default_distance = parseInt(process.env.DEFAULT_DISTANCE);
            const [latitude, longitude, city] = [req.body.latitude, req.body.longitude, req.body.city];
            if (!latitude || !longitude || !city){
                return res.json({status: "error", message: "Invalid form submission.", spaces: null})
            }
            const from = Date.now();
            const to = from + 3600000;
            const spaces = await Space.findAvailableSpaces(city, latitude, longitude, from, to, default_distance, false, false, false, false);
            const time_slot_prices = await TimeSlotPrice.getPrices();
            const additional_price = Utils.calculatePrice(from, to, time_slot_prices);
            var result = Space.makeResult(spaces, additional_price);

            res.json({status: "success", message: "Quick search successful.", spaces: result})

        }catch(err){
            console.error(err)
            res.json({status: "error", message: "Something went wrong.", spaces: null})
        }
    }

    static async advancedSearch(req, res){
        const [latitude, longitude, city, from, to, distance, security_measures, auto_approve, price] = [req.body.latitude, req.body.longitude, req.body.city, req.body.from, req.body.to, req.body.distance, req.body.security_measures, req.body.auto_approve, req.body.price];
        try{
            if (Utils.checkNullOrUndefined([latitude, longitude, city, from, to, distance, security_measures, auto_approve, price]) || (from >= to)){
                return res.json({status: "error", message: "Invalid form submission.", spaces: null})
            }
            const [guard, indoor, cc] = [security_measures.includes("guard"), security_measures.includes("indoor"), security_measures.includes("cc") || security_measures.includes("cctv")];
            const spaces = await Space.findAvailableSpaces(city, latitude, longitude, from, to, distance, guard, indoor, cc, auto_approve);
            const time_slot_prices = await TimeSlotPrice.getPrices();
            const additional_price = Utils.calculatePrice(from, to, time_slot_prices);
            var result = Space.makeResult(spaces, additional_price);
            result = Space.filterByPrice(result, price);

            res.json({status: "success", message: "Advanced search successful.", spaces: result})

        }catch(err){
            console.error(err)
            res.json({status: "error", message: "Something went wrong.", spaces: null})
        }

    } 
}