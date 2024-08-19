const { body } = require("express-validator")



const validateUserData = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3, max: 31 })
    .withMessage('Name should be at least 3-31 characters long'),
  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone()
    .withMessage('Invalid phone number')
    .isLength({ min: 11, max: 11 })
    .withMessage('Phone number should be exactly 11 characters long'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters long')
]

const validateLogin = [
    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
    body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters long')
  ]

const validateResetPassword = [
     body('oldPassword')
     .trim()
     .notEmpty()
     .withMessage('oldPassword field is required')
     .isLength({ min: 6 })
     .withMessage('Password should be at least 6 characters long'),

     body('newPassword')
     .trim()
     .notEmpty()
     .withMessage('newPassword field is required')
     .isLength({ min: 6 })
     .withMessage('Password should be at least 6 characters long')

]  

module.exports = {
    validateUserData,
    validateLogin,
    validateResetPassword
}