// create table if not exists space_owner (
//     owner_id serial not null primary key,
//     name varchar(255) not null,
//     email varchar(255) not null,
//     phone varchar(255) not null,
//     password varchar(255) not null
// );

module.exports = (sequelize, Sequelize) => {
    const SPACE_OWNER = sequelize.define("space_owner", {
        user_id: { type: Sequelize.INTEGER },
        name: { type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: false },
        phone: { type: Sequelize.STRING, allowNull: false },
        password: { type: Sequelize.STRING, allowNull: false }
        });
    SPACE_OWNER.removeAttribute('id');
    return SPACE_OWNER;
};