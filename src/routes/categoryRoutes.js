const router = require('express').Router();
const { createCategory, getCategories, updateCategory, deleteCategory, getCategoryById } = require('../controllers/category/categoryController');
const { authenticate } = require('../middlewares/auth/authenticate');
const checkAdminOrSuperAdmin = require('../middlewares/auth/checkAdminOrSuperAdmin');
const paginationMiddleware = require('../middlewares/paginationMiddleware');
 
const upload = require('../middlewares/upload');
const runValidation = require('../validators');
const { validateCategoryFields } = require('../validators/category/category');

router.get('/',paginationMiddleware,getCategories);
router.get('/:categoryId',getCategoryById);
router.post('/', authenticate , checkAdminOrSuperAdmin , upload.single('image'),validateCategoryFields, runValidation , createCategory);
router.put('/:categoryId', authenticate , checkAdminOrSuperAdmin , upload.single('image'),validateCategoryFields, runValidation ,  updateCategory);
router.delete('/:categoryId' , authenticate , deleteCategory);
 

module.exports = router;