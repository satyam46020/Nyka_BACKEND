
const jwt=require("jsonwebtoken")

const auth=(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1]
    if(!token){
        return res.send({msg:"login first"})
    }
    jwt.verify(token, "masai", function(err, decoded) {
        if(decoded){
            const userId=decoded.userId
            req.userId=userId
            next();
        }
    });
}
module.exports=auth