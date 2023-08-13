const db = require('../models');
const Utils = require('../utils/utils');


module.exports = class SearchController{
    static async quickSearch(req, res){
        const default_distance = process.env.DEFAULT_DISTANCE;
        try{
            const {latitude, longitude, city} = req.body;
            if (!latitude || !longitude || !city){
                return res.json({status: "error", message: "Invalid form submission.", spaces: null, prices: null})
            }
            var spaces = await db.space.findAll({
                where: { city: city, status: "active" || "requested" }
            })

            spaces = Utils.filterByDistance(latitude, longitude, spaces, default_distance);

            const from = Date.now();
            const to = from + 3600000;

            //spaces = Utils.filterByTime(from, to, spaces);

            const time_slot_prices = await db.time_slot_price.findAll({
                attributes: ['additional_price'],
            })
            
            const additional_price = Utils.calculatePrice(from, to, time_slot_prices);

            const prices = spaces.map(space => {
                return space.base_fare + additional_price;
            })

            res.json({status: "success", message: "Quick search successful.", spaces: spaces, prices: prices})

        }catch(err){
            console.error(err)
            res.json({status: "error", message: "Something went wrong.", spaces: null, prices: null})
        }
    }

    static async advancedSearch(req, res){
    }
}