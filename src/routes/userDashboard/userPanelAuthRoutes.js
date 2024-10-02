const router = require('express').Router();
const { userRegisterController, userLoginController, logoutController, saveUserOnfirebaseLogin } = require('../../controllers/user/authController');
const { authenticate } = require('../../middlewares/auth/authenticate');
const runValidation = require('../../validators');
const { validateUserData } = require('../../validators/user/auth');


router.post('/register',validateUserData,runValidation,userRegisterController);
router.post('/firebase-login',saveUserOnfirebaseLogin);
router.post('/login',userLoginController);
router.post('/logout',authenticate,logoutController);

module.exports = router;