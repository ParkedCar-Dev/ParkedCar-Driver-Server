const db = require('../models');

module.exports = class Utils {
    static getDistance(latitude1, longitude1, latitude2, longitude2) {
        const R = 6371e3; // metres
        const φ1 = latitude1 * Math.PI / 180; // φ, λ in radians
        const φ2 = latitude2 * Math.PI / 180;
        const Δφ = (latitude2 - latitude1) * Math.PI / 180;
        const Δλ = (longitude2 - longitude1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c / 1000; // in km
    }

    static filterByDistance(latitude1, longitude1, spaces, distance) {
        return spaces.filter(space => {
            distance = this.getDistance(latitude1, longitude1, space.latitude, space.longitude);
            space["distance"] = distance;
            return distance <= distance;
        });
    }

    static filterByTime(from, to, spaces) {
        const fromTime = new Date(from);
        const toTime = new Date(to);
        const fromDay = fromTime.getDay();
        const toDay = toTime.getDay();
        const fromHour = fromTime.getHours();
        const toHour = toTime.getHours();
        const toMinute = toTime.getMinutes();
        if (toMinute > 0) {
            toHour += 1;
        }
        const f_index = fromDay * 24 + fromHour;
        const t_index = toDay * 24 + toHour;

        return spaces.filter(space => {
            var available = true;
            for (var i = f_index; i <= t_index; i++) {
                if (space.time_slots[i] === false) {
                    available = false;
                    break;
                }
            }
            return available;
        });
    }

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
}