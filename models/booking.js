// create table if not exists booking(
//     booking_id serial not null primary key,
//     space_id integer not null references space(space_id),
//     driver_id integer not null references driver(user_id),
//     from_time bigint not null,
//     to_time bigint not null,
//     status varchar(255) not null,
//     created_at timestamp not null,
//     updated_at timestamp not null,
//     total_price double precision not null,
//     payment_id varchar(255) not null,
//     payment_status varchar(255) not null,
//     payment_medium varchar(255) not null,
//     medium_transaction_id varchar(255) not null
// );

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
        }, {
            sequelize,
            modelName: 'booking',
        })
        model.removeAttribute('id')
        return model
    }

    static buildBooking(space_id, driver_id, from_time, to_time, total_price, status){
        return super.build({
            space_id, driver_id, from_time, to_time, total_price, status,
            payment_id: 123, payment_status: "null", payment_medium: "null", medium_transaction_id: 123
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
}
