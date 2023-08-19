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

const {Model} = require('sequelize')

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
            driver_rating: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0 },
            space_rating: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0 },
        }, {
            sequelize,
            modelName: 'booking',
        })
        model.removeAttribute('id')
        return model
    }
}
