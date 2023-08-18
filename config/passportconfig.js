const JwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const db  = require('../models');
const userTable = db.driver;

const opts = {
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

module.exports = (passport) => {
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try{
            const user = await userTable.findOne({where: {user_id: jwt_payload.id}})
            if (user){
                return done(null, user)
            }else{
                return done(null, false)
            }
        }catch(err){
            console.error(err.message)
            return done(err, false)
        }
    }))
}