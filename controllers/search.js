const Utils = require('../utils/utils');
const Space = require('../models/space');

module.exports = class SearchController{
    static async quickSearch(req, res){
        const default_distance = process.env.DEFAULT_DISTANCE;
        try{
            const {latitude, longitude, city} = req.body;
            if (!latitude || !longitude || !city){
                return res.json({status: "error", message: "Invalid form submission.", spaces: null})
            }
            var spaces = await Space.findAll({
                where: { city: {
                    [db.Sequelize.Op.iLike]: city
                }, status: "active" || "requested" 
                }
            })

            spaces = Utils.filterByDistance(latitude, longitude, spaces, default_distance);

            const from = Date.now();
            const to = from + 3600000;

            spaces = Utils.filterByTime(from, to, spaces);

            const time_slot_prices = await db.time_slot_price.findAll({
                attributes: ['additional_price'],
            })
            
            const additional_price = Utils.calculatePrice(from, to, time_slot_prices);

            const prices = spaces.map(space => {
                return space.base_fare + additional_price;
            })

            var result = spaces.map((space, index) => {
                return {
                    id: space.space_id,
                    address: space.address,
                    latitude: space.latitude,
                    longitude: space.longitude,
                    distance: space.distance,
                    price: prices[index],
                    security_measures: space.security_measures,
                    width: space.width,
                    height: space.height,
                    length: space.length,
                    auto_approve: space.auto_approve,
                    user_id: space.user_id,
                    rating: space.rating,
                    total_books: space.total_books,
                }
            })

            res.json({status: "success", message: "Quick search successful.", spaces: result})

        }catch(err){
            console.error(err)
            res.json({status: "error", message: "Something went wrong.", spaces: null})
        }
    }

    static async advancedSearch(req, res){
    }
}