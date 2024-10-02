const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../../secret');
const User = require('../../models/User');
const CustomError = require('../../errors/CustomError');

const superAdminRegisterController = async(req,res,next)=>{
              const {username,phoneNumber,email,password,role} = req.body;
              try {
                     const entity = await User.findOne({email:email});
                     if(entity){
                           return next(new CustomError('User already Exists with this email'));
                     }
                     const saltRounds = 10;
                     const hashedPassword = await bcrypt.hash(password, saltRounds);

                     const newEntity = new User({
                         username:username,
                         phoneNumber:phoneNumber,
                         email:email,
                         password:hashedPassword,
                         role:role || 'user'
                     });
                     
                     await newEntity.save();

                     const newUser = {
                        username: newEntity.username,
                        phoneNumber:newEntity.phoneNumber,
                        email: newEntity.email,
                        role: newEntity.role,  
                      };

                     res.status(200).json({message:'User registered succefully',newUser}); 

              } catch (err) {
                   next(new CustomError(err.message,500));
              }
}

 
const loginController = async(req,res,next)=>{
        const{email,password} = req.body
       
        try {
               const user = await User.findOne({ email: { $regex: new RegExp(email, 'i') } });
                         
               if(!user){
                     return next(new CustomError('Unauthorized',403))
               }
               if(user.role  === 'user'){
                   return next(new CustomError('Access Denied: Only admins are authorized to log in',403))
               }
               const isMatch = await bcrypt.compare(password,user.password);
               if(!isMatch){
                     return next(new CustomError('Invalid Credential',403));
               }
       
               const payload = {
                   id:user.id,
                   name:user.username,
                   email:user.email,
                   role:user.role
               }
       
               const token = jwt.sign(payload,secretKey,{expiresIn:'1hr'});
               res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
               if(!token){
                    return next(new CustomError('Failed to generate token'));
               }
       
               return res.status(202).json({message:'Login Successfull',token,data:{user:payload}});

        } catch (err) {
              next(new CustomError(err.message,500));
        }
} 

const logoutController =  (_req, res) => {
      res.clearCookie('jwt');
      res.status(200).json({ message: 'Logged out successfully' });
};

const userRegisterController  = async(req,res,next)=>{
       try{
                const{username,phoneNumber,email,password} = req.body;
                const user  = await User.findOne({email:email});
                if(user){
                       return next(new CustomError('User already exists with this email',403));    
                }
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                const newUser = new User({
                    username:username,
                    phoneNumber:phoneNumber,
                    email:email,
                    password:hashedPassword,
                    role:"user"
                });
                await newUser.save();

                const responseUser = {
                   username: newUser.username,
                   phoneNumber:newUser.phoneNumber,
                   email: newUser.email,
                   role: newUser.role,  
                 };

                res.status(200).json({message:'User registered succefully',responseUser}); 

       }catch(err){
               next(new CustomError(err.message,500));
       }
}

const userLoginController = async(req,res,next)=>{
              const{email,password} = req.body
       
        try {
               const user = await User.findOne({ email: { $regex: new RegExp(email, 'i') } });
                         
               if(!user){
                     return next(new CustomError('Unauthorized',403))
               }
               if(user.role  !== 'user'){
                   return next(new CustomError('Only Registered user can access',403))
               }
               const isMatch = await bcrypt.compare(password,user.password);
               console.log(password,)
               if(!isMatch){
                     return next(new CustomError('Invalid Credential',403));
               }
       
               const payload = {
                   id:user.id,
                   name:user.username,
                   email:user.email,
                   role:user.role
               }
       
               const token = jwt.sign(payload,secretKey,{expiresIn:'1hr'});
               res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
               if(!token){
                    return next(new CustomError('Failed to generate token'));
               }
       
               return res.status(202).json({message:'Login Successfull',token,data:{user:payload}});

        } catch (err) {
              next(new CustomError(err.message,500));
        }
}

module.exports = {

     superAdminRegisterController,
     logoutController,
     loginController,
     logoutController,
     userRegisterController,
     userLoginController

}