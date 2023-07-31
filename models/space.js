// create table if not exists space (
//     space_id serial not null primary key,
//     width double precision not null,
//     length double precision not null,
//     height double precision not null,
//     base_fare double precision not null,
//     user_id integer not null references space_owner(user_id),
//     security_measures varchar(255) not null,
//     status varchar(255) not null,
//     rating double precision,
//     total_books integer not null,
//     auto_approve boolean not null,
//     address varchar(255) not null,
//     city varchar(255) not null,
//     latitude double precision not null,
//     longitude double precision not null,
//     created_at timestamp not null,
//     updated_at timestamp not null,
//     availability_mask varchar(336) not null,
//     time_slots boolean[336] not null
// );

module.exports = (sequelize, Sequelize) => {
    const SPACE = sequelize.define("space", {
        space_id: { type: Sequelize.INTEGER },
        width: { type: Sequelize.DOUBLE, allowNull: false },
        length: { type: Sequelize.DOUBLE, allowNull: false },
        height: { type: Sequelize.DOUBLE, allowNull: false },
        base_fare: { type: Sequelize.DOUBLE, allowNull: false },
        user_id: { type: Sequelize.INTEGER, allowNull: false },
        security_measures: { type: Sequelize.STRING, allowNull: false },
        status: { type: Sequelize.STRING, allowNull: false },
        rating: { type: Sequelize.DOUBLE, allowNull: true },
        total_books: { type: Sequelize.INTEGER, allowNull: false },
        auto_approve: { type: Sequelize.BOOLEAN, allowNull: false },
        address: { type: Sequelize.STRING, allowNull: false },
        city: { type: Sequelize.STRING, allowNull: false },
        latitude: { type: Sequelize.DOUBLE, allowNull: false },
        longitude: { type: Sequelize.DOUBLE, allowNull: false },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        availability_mask: { type: Sequelize.STRING, allowNull: false },
        time_slots: { type: Sequelize.ARRAY(Sequelize.BOOLEAN), allowNull: false }
        });
    SPACE.removeAttribute('id');
    return SPACE;
}