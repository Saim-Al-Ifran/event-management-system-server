const CustomError = require("../../errors/CustomError");
const authorizeSuperAdmin = async(req,_res,next)=>{
    if(req.user.role !== 'super-admin'){
        return next(new CustomError('Only super-admin can access',403));
    }
    next();
}

module.exports = authorizeSuperAdmin;