const authorizeUser = (req, _res, next) => {
    if (req.user && req.user.role === 'user') {
        next();
    } else {
        return next(new CustomError('This route is only for users',403));
    }
};


module.exports = authorizeUser;
