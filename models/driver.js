// create table if not exists driver (
//     user_id integer not null primary key default nextval('user_id'),
//     name varchar(255) not null,
//     email varchar(255) not null,
//     phone varchar(255) not null,
//     password varchar(255) not null,
//     rating double precision
// );

module.exports = (sequelize, Sequelize) => {
    const DRIVER = sequelize.define("driver", {
        user_id: { type: Sequelize.INTEGER },
        name: { type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: false },
        phone: { type: Sequelize.STRING, allowNull: false },
        password: { type: Sequelize.STRING, allowNull: false },
        rating: { type: Sequelize.DOUBLE, allowNull: true }
        });
    DRIVER.removeAttribute('id');
    return DRIVER;
}