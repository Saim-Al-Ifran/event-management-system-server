const router = require('express').Router();
const authorizeAdmin = require('../../middlewares/auth/authorizeAdmin');
const { authenticate } = require('../../middlewares/auth/authenticate'); 
const { 
    adminGetAllUsers,
    adminUpdateUser,
    adminCreateUser,
    adminGetSingleUser,
    adminDeleteUser, 
    adminBlockUnblockUser,
    getAdminProfile,
    updateAdminProfile,
    resetAdminPassword,
    updateAdminProfileImage,
    getAdminProfileImage,
    
} = require('../../controllers/user/userController');

const upload = require('../../middlewares/upload');
const { validateUserData } = require('../../validators/user/auth');
const runValidation = require('../../validators');

 

router.get('/users', authenticate, authorizeAdmin, adminGetAllUsers);
router.get('/users/:userId', authenticate, authorizeAdmin, adminGetSingleUser);
router.put('/users/:userId', authenticate, authorizeAdmin,validateUserData , runValidation, adminUpdateUser);
router.post('/users', authenticate, authorizeAdmin,validateUserData , runValidation, adminCreateUser);
router.delete('/users/:userId', authenticate, authorizeAdmin, adminDeleteUser);
router.patch('/users/:userId/blockunblock',  authenticate , authorizeAdmin, adminBlockUnblockUser);
router.get('/profile', authenticate, authorizeAdmin , getAdminProfile);
router.put('/profile', authenticate, authorizeAdmin , validateUserData , runValidation, updateAdminProfile);
router.put('/change-password', authenticate, authorizeAdmin, resetAdminPassword); 
router.patch('/upload-profile-image', authenticate , authorizeAdmin , upload.single('image') , updateAdminProfileImage);
router.get('/upload-profile-image', authenticate ,  authorizeAdmin , getAdminProfileImage);  
module.exports = router;