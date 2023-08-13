const db = require('../models');
const table = db.space;
const Utils = require('../utils/utils');


module.exports = class SearchController{
    static async quickSearch(req, res){
        const default_distance = process.env.DEFAULT_DISTANCE;
        try{
            const {latitude, longitude, city} = req.body;
            if (!latitude || !longitude || !city){
                return res.json({status: "error", message: "Invalid form submission.", spaces: null})
            }
            var spaces = await table.findAll({
                where: { city: city, status: "active" || "requested" },
            })

            spaces = Utils.filterByDistance(latitude, longitude, spaces, default_distance);

            const from = Date.now();
            const to = from + 3600000;

            spaces = Utils.filterByTime(from, to, spaces);

            res.json({status: "success", message: "Quick search successful.", spaces: spaces})

        }catch(err){
            console.error(err.message)
            res.json({status: "error", message: "Something went wrong.", spaces: null})
        }
    }

    // {
    //     "latitude": 23.811,
    //     "longitude": 90.407,
    //     "from": 1639172876,
    //     "to": 163917452,
    //     "distance": 5,
    //     "price": 100,
    //     "security":  ["cc", "guard", "indoor"]
    // }

    static async advancedSearch(req, res){
        try{
            const {latitude, longitude, from, to, distance, price, security} = req.body;
            if (!latitude || !longitude || !from || !to || !distance || !slots || !price || !security){
                return res.json({status: "error", message: "Invalid form submission.", spaces: null})
            }
            const spaces = await table.findAll({
                where: {
                    latitude: {[db.Sequelize.Op.between]: [
                        latitude - distance/111.12, 
                        latitude + distance/111.12
                    ]},
                    longitude: {[db.Sequelize.Op.between]: [
                        longitude - distance/(111.12 * Math.cos(latitude * (Math.PI / 180))), 
                        longitude + distance/(111.12 * Math.cos(latitude * (Math.PI / 180)))
                    ]},
                    slots: {[db.Sequelize.Op.gte]: slots},
                    price: {[db.Sequelize.Op.lte]: price},
                    security: {[db.Sequelize.Op.contains]: security}
                },
                attributes: {
                    include: [
                        [db.sequelize.literal(`6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))`), 'distance']
                    ]
                },
                order: db.sequelize.col('distance')
            })
                

            res.json({status: "success", message: "Advanced search successful.", spaces: spaces})

        }catch(err){
            console.error(err.message)
            res.json({status: "error", message: "Something went wrong.", spaces: null})
        }
    }
}