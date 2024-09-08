const { body } = require('express-validator');

const validateSettingFields = [
    body('siteName')
        .notEmpty()
        .withMessage('Site name is required'),

    body('siteLogo')
        .optional()
        .notEmpty()
        .withMessage('Site logo is required'),

    body('footerDescription')
        .notEmpty()
        .withMessage('Footer description is required'),

    body('facebook')
        .notEmpty()
        .withMessage('Facebook link is required')
        .isURL()
        .withMessage('Facebook link must be a valid URL'),

    body('twitter')
        .notEmpty()
        .withMessage('Twitter link is required')
        .isURL()
        .withMessage('Twitter link must be a valid URL'),

    body('instagram')
        .notEmpty()
        .withMessage('Instagram link is required')
        .isURL()
        .withMessage('Instagram link must be a valid URL')
];

module.exports = {
    validateSettingFields
};
