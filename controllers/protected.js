module.exports = class TestController{
    static async protected(req, res){
        try{
            res.json({status: "success", message: "Protected route."})
        }catch(err){
            console.error(err.message)
            res.json({status: "error"})
        }
    }
}