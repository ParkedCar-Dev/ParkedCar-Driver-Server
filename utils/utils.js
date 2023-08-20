const db = require('../models');

module.exports = class Utils {
    
    static calculatePrice(from, to, time_slot_prices) {
        var fromTime = new Date(from);
        var toTime = new Date(to);
        var fromHour = fromTime.getHours();
        var toHour = toTime.getHours();
        var toMinute = toTime.getMinutes();
        if (toMinute > 0) {
            toHour += 1;
        }
        var f_index = (fromHour + 1) % 24;
        var t_index = (toHour + 1) % 24;

        var price = 0;
        for (var i = f_index; i <= t_index; i++) {
            price += time_slot_prices[i].additional_price;
        }
        return price;
    }

    static filterByPrice(spaces, prices, price) {
        return spaces.filter((space, index) => {
            return prices[index] <= price;
        });
    }

    static checkNullOrUndefined(array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == null || array[i] == undefined) {
                return true;
            }
        }
        return false;
    }
}