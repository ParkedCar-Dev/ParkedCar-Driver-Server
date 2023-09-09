const {Model, Op} = require('sequelize')

module.exports = class Booking extends Model{
    static init(sequelize, Sequelize){
        var model = super.init({
            booking_id: { type: Sequelize.INTEGER },
            space_id: { type: Sequelize.INTEGER, allowNull: false },
            driver_id: { type: Sequelize.INTEGER, allowNull: false },
            from_time: { type: Sequelize.BIGINT, allowNull: false },
            to_time: { type: Sequelize.BIGINT, allowNull: false },
            status: { type: Sequelize.STRING, allowNull: false },
            created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
            updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
            total_price: { type: Sequelize.DOUBLE, allowNull: false },
            payment_id: { type: Sequelize.STRING, allowNull: false },
            payment_status: { type: Sequelize.STRING, allowNull: false },
            payment_medium: { type: Sequelize.STRING, allowNull: false },
            medium_transaction_id: { type: Sequelize.STRING, allowNull: false },
            base_fare: { type: Sequelize.DOUBLE, allowNull: false },
        }, {
            sequelize,
            modelName: 'booking',
        })
        model.removeAttribute('id')
        return model
    }

    static buildBooking(space_id, driver_id, from_time, to_time, total_price, status, base_fare){
        return super.build({
            space_id, driver_id, from_time, to_time, total_price, status, base_fare,
            payment_id: 123, payment_status: "unpaid", payment_medium: "null", medium_transaction_id: 123
        })
    }

    static async isTimeAvailable(space_id, from_time, to_time){
        const bookings = await this.sequelize.query(`
            select 1 from booking
            where space_id = :space_id
            and status = 'active'
            and (
                (:from_time between from_time and to_time)
                or (:to_time between from_time and to_time)
                );`, {
            replacements: {space_id, from_time, to_time},
            type: this.sequelize.QueryTypes.SELECT
        })
        return bookings.length == 0
    }

    static async getBookingsByStatus(status, driver_id){
        return await Booking.sequelize.query(
            `SELECT booking.booking_id, booking.from_time, booking.to_time, booking.status, booking.base_fare,
            booking.total_price as total_fare, booking.payment_id, booking.payment_status, booking.payment_medium,
            space.address as address, space.city as city, space.rating as rating,
            booking.total_price - booking.base_fare as time_fare
            FROM booking 
            INNER JOIN space ON booking.space_id = space.space_id 
            WHERE booking.driver_id = :driver_id AND booking.status = :status`,
            {
                replacements: {driver_id: driver_id, status: status},
                type: Booking.sequelize.QueryTypes.SELECT
            }
        )
    }

    static async getPastBookings(driver_id){
        return await Booking.sequelize.query(
            `SELECT booking.booking_id, booking.from_time, booking.to_time, booking.status, booking.base_fare,
            booking.total_price as total_fare, booking.payment_id, booking.payment_status, booking.payment_medium,
            space.address as address, space.city as city, space.rating as rating,
            booking.total_price - booking.base_fare as time_fare
            FROM booking 
            INNER JOIN space ON booking.space_id = space.space_id 
            WHERE booking.driver_id = :driver_id AND (booking.status = 'completed' 
            OR booking.status = 'cancelled' OR booking.status = 'declined')`,
            {
                replacements: {driver_id: driver_id},
                type: Booking.sequelize.QueryTypes.SELECT
            }
        )
    }
}
