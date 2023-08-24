// create table if not exists time_slot_prices (
//     time_slot_id serial not null primary key,
//     from_time int not null,
//     to_time int not null,
//     additional_price double precision not null
// );

const { Model } = require("sequelize");

module.exports = class TimeSlotPrice extends Model {
    static prices = null;
    static init(sequelize, DataTypes) {
        const model =  super.init(
            {
                time_slot_id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                from_time: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                to_time: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                additional_price: {
                    type: DataTypes.DOUBLE,
                    allowNull: false
                }
            },
            {
                tableName: "time_slot_prices",
                sequelize
            }
        );
        model.removeAttribute("id");
        return model;
    }

    static async getPrices() {
        if (TimeSlotPrice.prices == null) {
            console.log("Fetching time slot prices from database");
            TimeSlotPrice.prices = await this.findAll(
                {
                    attributes: ["additional_price"]
                }
            );
        }
        return TimeSlotPrice.prices;
    }
}