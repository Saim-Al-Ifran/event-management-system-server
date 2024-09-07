const { body } = require("express-validator");

const validateCategoryFields = [
    body('name')
    .notEmpty()
    .withMessage('category name is required'),

    body('description')
    .notEmpty()
    .withMessage('Description is required'),

    body('image')
    .optional() 
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
    })
 
  ];

 
  
module.exports = {
    validateCategoryFields
}  