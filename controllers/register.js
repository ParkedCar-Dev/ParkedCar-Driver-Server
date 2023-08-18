const db = require('../models');
const bcrypt = require('bcrypt');
const userTable = db.driver;

module.exports = class RegisterController{
    static async register(req, res){
        try{
            const {name, email, phone, password} = req.body;
            if (!name || !email || !phone || !password){
                return res.json({status: "error", message: "Invalid form submission."})
            }
            const existingUser = await userTable.findOne({where: {email: email}})
            if (existingUser){
                return res.json({status: "error", message: "User already exists."})
            }
            const hash = await bcrypt.hash(password, 10);
            await userTable.create({name: name, email: email, phone: phone, password: hash})
            res.json({status: "success", message: "User registered successfully."})
        }catch(err){
            console.error(err.message)
            res.json({status: "error", message: "Something went wrong."})
        }
    }
}