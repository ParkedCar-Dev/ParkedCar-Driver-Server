const url = require('url');
require('dotenv').config()

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':')

const config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true,
    dialect: "postgres",
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    
}

module.exports = config;