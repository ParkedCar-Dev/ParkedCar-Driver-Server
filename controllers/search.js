const db = require('../models');
const table = db.space;


module.exports = class SearchController{
    static async quickSearch(req, res){
        const default_distance = process.env.DEFAULT_DISTANCE;
        try{
            const {latitude, longitude, city} = req.body;
            if (!latitude || !longitude || !city){
                return res.json({status: "error", message: "Invalid form submission.", spaces: null})
            }
            const spaces = await table.findAll({
                where: {
                    city: city,
                    latitude: {[db.Sequelize.Op.between]: [
                        latitude - default_distance/111.12, 
                        latitude + default_distance/111.12
                    ]},
                    longitude: {[db.Sequelize.Op.between]: [
                        longitude - default_distance/(111.12 * Math.cos(latitude * (Math.PI / 180))), 
                        longitude + default_distance/(111.12 * Math.cos(latitude * (Math.PI / 180)))
                    ]}
                },
                attributes: {
                    include: [
                        [db.sequelize.literal(`6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))`), 'distance']
                    ]
                },
                order: db.sequelize.col('distance')
            })
                

            res.json({status: "success", message: "Quick search successful.", spaces: spaces})

        }catch(err){
            console.error(err.message)
            res.json({status: "error", message: "Something went wrong.", spaces: null})
        }
    }
}