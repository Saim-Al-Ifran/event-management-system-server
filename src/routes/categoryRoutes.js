const router = require('express').Router();
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/category/categoryController');
const { authenticate } = require('../middlewares/auth/authenticate');
const checkAdminOrSuperAdmin = require('../middlewares/auth/checkAdminOrSuperAdmin');
const upload = require('../middlewares/upload');
const runValidation = require('../validators');
const { validateCategoryFields } = require('../validators/category/category');

router.get('/', authenticate , checkAdminOrSuperAdmin ,getCategories);
router.post('/', authenticate , checkAdminOrSuperAdmin , upload.single('image'),validateCategoryFields, runValidation , createCategory);
router.put('/:categoryId', authenticate , checkAdminOrSuperAdmin , upload.single('image') , validateCategoryFields, runValidation , updateCategory);
router.delete('/:categoryId' , authenticate , deleteCategory);
 

module.exports = router;