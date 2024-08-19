
const CustomError = require("../../errors/CustomError");

const checkUserRole = (user, role) => {
 
    if (user.role !== role) {
        throw new CustomError(`Access Denied: Admins can only perform this action on users`, 403);
    }
};

module.exports = { checkUserRole };
