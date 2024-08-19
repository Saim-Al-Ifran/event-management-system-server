const { sendMessageController } = require('../../controllers/contact/contactController');
const { createEvent, getUserEvents, updateUserEvent, userDeleteEvent } = require('../../controllers/event/eventController');
const { 
    getUserProfile,
    userProfileUpdate,
    resetUserPassword,
    getUserProfileImage,
    updateUserProfileImage
} = require('../../controllers/user/userController');
const { authenticate } = require('../../middlewares/auth/authenticate');
const authorizeUser = require('../../middlewares/auth/authorizeUser');
const upload = require('../../middlewares/upload');
const runValidation = require('../../validators');
const { validateResetPassword } = require('../../validators/user/auth');

const router = require('express').Router();


router.get('/profile', authenticate , authorizeUser, getUserProfile);
router.put('/profile', authenticate , authorizeUser, userProfileUpdate);
router.put('/change-password',authenticate,authorizeUser,validateResetPassword,runValidation,resetUserPassword);
router.patch('/upload-profile-image',authenticate,authorizeUser,upload.single('image'),updateUserProfileImage);
router.get('/upload-profile-image',authenticate,authorizeUser,getUserProfileImage);
router.post('/event',authenticate,authorizeUser,upload.single('image'),createEvent);
router.get('/event',authenticate,authorizeUser,getUserEvents);
router.put('/event/:eventId',authenticate,authorizeUser,updateUserEvent);
router.delete('/event/:eventId',authenticate,authorizeUser,userDeleteEvent);
router.post('/send-message',authenticate,authorizeUser,sendMessageController);


module.exports = router;