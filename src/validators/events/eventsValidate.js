const { body } = require('express-validator');

const validateEventFields = [
    body('title')
        .notEmpty()
        .withMessage('Event title is required'),

    body('description')
        .notEmpty()
        .withMessage('Event description is required'),

    body('date')
        .notEmpty()
        .withMessage('Event date is required'),

    body('location')
        .notEmpty()
        .withMessage('Event location is required'),

    body('capacity')
        .notEmpty()
        .withMessage('Event capacity is required'),

    body('image')
        .custom((_value, { req }) => {
            if (!req.file) {
                throw new Error('Image field required');
            }
            return true;
        })
        .custom((_value, { req }) => {
            const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedFileTypes.includes(req.file.mimetype)) {
                throw new Error('Invalid file type for image');
            }
            return true;
        }),

    body('category')
        .notEmpty()
        .withMessage('Event category is required'),

    body('price')
        .notEmpty()
        .withMessage('Event price is required'),
 
];

 
module.exports = {
    validateEventFields
};
