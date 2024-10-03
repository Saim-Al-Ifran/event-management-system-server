const jwt = require('jsonwebtoken');
const CustomError = require('../../errors/CustomError');
const { secretKey } = require('../../secret');
const User = require('../../models/User');
const admin = require('../../firebase/firebase')

const authenticate = async(req,_res,next)=>{
    try{
        const authHeader = req.headers.authorization;
        let token = req.cookies.jwt || (authHeader && authHeader.split(' ')[1]);
        if(!token){
              return next(new CustomError('unauthorized',403));
        }

        let decoded;
        let user;
        try {
          decoded = jwt.verify(token, secretKey);
          user = await User.findById({ _id: decoded.id });
        } catch (err) {
          if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') { 
            try {
              decoded = await admin.auth().verifyIdToken(token);
              user={...decoded,role:'user'};
             
            } catch (firebaseErr) {
                return next(new CustomError('Firebase authentication server problem', 500));

            }
          }else {
            throw err;
          }
        }
        console.log(user);
        req.user = user;
        next();
     }catch(err){
             
      if (err.name === 'TokenExpiredError') {
        return next(new CustomError('Token expired! please login',401));
      }
  
      if (err.name === 'JsonWebTokenError') {
           return next(new CustomError('Invalid token',401));
      }
      if (err.name === 'SyntaxError') {
         return next(new CustomError('Invalid token',401));
      }
   
      return next(new CustomError('Authentication server problem',500));

     }
}


module.exports ={
    authenticate
}