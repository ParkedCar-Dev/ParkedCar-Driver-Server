const {Model} = require('sequelize')
const Utils = require('../utils/utils')

module.exports = class Space extends Model{
    static init(sequelize, Sequelize){
        var model = super.init({
            space_id: { type: Sequelize.INTEGER },
            width: { type: Sequelize.DOUBLE, allowNull: false },
            length: { type: Sequelize.DOUBLE, allowNull: false },
            height: { type: Sequelize.DOUBLE, allowNull: false },
            base_fare: { type: Sequelize.DOUBLE, allowNull: false },
            user_id: { type: Sequelize.INTEGER, allowNull: false },
            security_measures: { type: Sequelize.STRING, allowNull: false },
            status: { type: Sequelize.STRING, allowNull: false },
            rating: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0 },
            total_books: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
            auto_approve: { type: Sequelize.BOOLEAN, allowNull: false },
            address: { type: Sequelize.STRING, allowNull: false },
            city: { type: Sequelize.STRING, allowNull: false },
            latitude: { type: Sequelize.DOUBLE, allowNull: false },
            longitude: { type: Sequelize.DOUBLE, allowNull: false },
            created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
            updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
            availability_mask: { type: Sequelize.STRING, allowNull: false },
            time_slots: { type: Sequelize.ARRAY(Sequelize.BOOLEAN), allowNull: false }
            }, {
                sequelize,
                modelName: 'space',
        })
        model.removeAttribute('id')
        return model
    }

    static async find_available_spaces(city, latitude, longitude, from, to, distance){
        return await this.sequelize.query(
            `Select s.*,
            earth_distance(
                ll_to_earth(:latitude, :longitude),
                ll_to_earth(s.latitude, s.longitude)
            ) as distance
            FROM
                space s
            WHERE
                lower(s.city) = lower(:city)
                AND s.status = 'active'
                AND earth_distance(
                    ll_to_earth(:latitude, :longitude),
                    ll_to_earth(s.latitude, s.longitude)
                ) < :distance
                AND NOT EXISTS (
                    SELECT 1
                    FROM booking b
                    WHERE
                        b.space_id = s.space_id
                        AND b.from_time < :to_time
                        AND b.to_time > :from_time);`, 
        {
            replacements: {
                city: city,
                latitude: latitude,
                longitude: longitude,
                from_time: from,
                to_time: to,
                distance: distance
            },
            type: this.sequelize.QueryTypes.SELECT
        })
    }
    
}  