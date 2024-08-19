const router = require('express').Router();
const { userRegisterController, userLoginController, logoutController } = require('../../controllers/user/authController');
const { authenticate } = require('../../middlewares/auth/authenticate');
const runValidation = require('../../validators');
const { validateLogin } = require('../../validators/user/auth');


router.post('/register',validateLogin,runValidation,userRegisterController);
router.post('/login',userLoginController);
router.post('/logout',authenticate,logoutController);

module.exports = router;