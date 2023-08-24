const User = require('../models/driver.js');

module.exports = class RegisterController{
    static async register(req, res){
        try{
            const user = await User.buildUser(req);
            if(!user) return res.json({status: "error", message: "Invalid form submission."});
            const existingUser = await User.findOne({where: {email: user.email}})
            if (existingUser){
                return res.json({status: "error", message: "User already exists."})
            }
            await user.save();
            return res.json({status: "success", message: "User registered successfully."})
        }catch(err){
            console.error(err.message)
            return res.json({status: "error", message: "Something went wrong."})
        }
    }
}