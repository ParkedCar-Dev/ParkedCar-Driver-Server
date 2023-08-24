module.exports = class Utils {
    
    static calculatePrice(from, to, time_slot_prices) {
        var total_price = 0.0;
        var fromTime = new Date(from);
        var toTime = new Date(to);
        var fromDay = fromTime.getDay();
        var toDay = toTime.getDay();
        var fromHour = fromTime.getHours();
        var fromMinute = fromTime.getMinutes();
        var toHour = toTime.getHours();
        var toMinute = toTime.getMinutes();
        var numFullDays = Math.floor((to - from) / (1000 * 60 * 60 * 24));
        if (numFullDays > 0) {
            total_price = time_slot_prices.reduce((total, slot) => total + slot.additional_price * numFullDays, 0);
        }
        if (fromDay == toDay) {
            var f_index = (fromHour + 1) % 24;
            var t_index = (toHour + 1) % 24;
            for (var i = f_index; i < t_index; i++) {
                total_price += time_slot_prices[i].additional_price;
            }
        } else {
            if (fromHour > toHour) {
                var f_index = (fromHour + 1) % 24;
                var t_index = (toHour + 1) % 24;
                for (var i = f_index; i < 24; i++) {
                    total_price += time_slot_prices[i].additional_price;
                }
                for (var i = 0; i < t_index; i++) {
                    total_price += time_slot_prices[i].additional_price;
                }
            }
            else {
                var f_index = (fromHour + 1) % 24;
                var t_index = (toHour + 1) % 24;
                for (var i = f_index; i < t_index; i++) {
                    total_price += time_slot_prices[i].additional_price;
                }
            }
        }

        total_price -= time_slot_prices[f_index].additional_price * fromMinute / 60;
        total_price += time_slot_prices[t_index].additional_price * toMinute / 60;

        return Math.floor(total_price);
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