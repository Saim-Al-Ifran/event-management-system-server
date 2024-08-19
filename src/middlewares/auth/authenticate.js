const jwt = require('jsonwebtoken');
const CustomError = require('../../errors/CustomError');
const { secretKey } = require('../../secret');
const User = require('../../models/User');

const authenticate = async(req,_res,next)=>{
    try{
        let token = req.cookies.jwt; 
        console.log(token);
        if(!token){
              return next(new CustomError('unauthorized',403));
        }

        const decoded = jwt.verify(token,secretKey);
        const user = await User.findById({_id:decoded.id});
        if(!user){
               return next(new CustomError('unauthorized',401));
        } 
    
        req.user = user;

        next();
     }catch(err){
             
      if (err.name === 'TokenExpiredError') {
        return next(new CustomError('Token expired',401));
      }
  
      if (err.name === 'JsonWebTokenError') {
           return next(new CustomError('Invalid token',401));
      }
      if (err.name === 'SyntaxError') {
         return next(new CustomError('Invalid token',401));
      }
   
      next(new CustomError('Authentication server problem',500));

     }
}


module.exports ={
    authenticate
}