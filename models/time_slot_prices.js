// create table if not exists time_slot_prices (
//     time_slot_id serial not null primary key,
//     from_time int not null,
//     to_time int not null,
//     additional_price double precision not null
// );

module.exports = (sequelize, Sequelize) => {
    const TIME_SLOT_PRICE = sequelize.define("time_slot_prices", {
        time_slot_id: { type: Sequelize.INTEGER },
        from_time: { type: Sequelize.INTEGER, allowNull: false },
        to_time: { type: Sequelize.INTEGER, allowNull: false },
        additional_price: { type: Sequelize.DOUBLE, allowNull: false }
        });
    TIME_SLOT_PRICE.removeAttribute('id');
    return TIME_SLOT_PRICE;
}