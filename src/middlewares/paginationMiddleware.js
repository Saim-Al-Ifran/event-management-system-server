const CustomError = require("../errors/CustomError")

const paginationMiddleware = (req, _res, next)=> {
  try {
    const page = parseInt(req.query.page , 10) || 1;
    const limit = parseInt(req.query.limit , 10) || 10;

    if (page <= 0 || limit <= 0) {
      return next(new CustomError('Invalid page or limit parameters', 400));
    }

    req.pagination = { page, limit };

    next();
  } catch (error) {
    console.error(error.message);
    next(new CustomError('Internal Server Error', 500));
  }
};

module.exports = paginationMiddleware;