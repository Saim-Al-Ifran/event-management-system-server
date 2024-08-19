const CustomError = require("../../errors/CustomError");
const { secretKey } = require("../../secret");
const jwt = require('jsonwebtoken');

const authorization = (req, _res, next) => {

    const token = req.cookies.jwt;

    if (!token) {
      return next(new CustomError('Unauthorized',403));
    }

    try {

      const data = jwt.verify(token,secretKey);
      req.userId = data.id;
      req.userRole = data.role;
      return next();

    } catch(err) {

      next(new CustomError(err.message,500));

    }

  };

  module.exports = {
     authorization
  }