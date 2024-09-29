const CustomError = require("../../errors/CustomError");

const checkAdminOrSuperAdmin = (req, _res, next) => {
    try {
         
        const user = req.user; 
        if (!user || (user.role !== 'admin' && user.role !== 'super-admin')) {
          return next(new CustomError('Unauthorized: Access denied. Admin or superadmin role required', 403));
        }
        next();
    } catch (error) {
        next(new CustomError(error.message,500));  
    }
};


module.exports = checkAdminOrSuperAdmin;