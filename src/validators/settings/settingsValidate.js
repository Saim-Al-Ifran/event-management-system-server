const { body } = require('express-validator');


const validateSettingFields = [
    body('siteName')
        .notEmpty()
        .withMessage('Site name is required'),

    body('siteTitle')
        .notEmpty()
        .withMessage('Site title is required'),

    body('themeColor')
        .notEmpty()
        .withMessage('Theme color is required'),

    body('footerDescription')
        .notEmpty()
        .withMessage('Footer description is required'),

    body('taxOnTicket')
        .notEmpty()
        .withMessage('Tax on ticket is required')
        .isNumeric()
        .withMessage('Tax on ticket must be a number'),

    body('backupAndRestore')
        .optional()
        .isBoolean()
        .withMessage('Backup and restore must be a boolean'),

    body('currencyOptions')
        .notEmpty()
        .withMessage('Currency options is required'),

    body('siteLanguage')
        .notEmpty()
        .withMessage('Site language is required')
];

module.exports = {
    validateSettingFields
}
