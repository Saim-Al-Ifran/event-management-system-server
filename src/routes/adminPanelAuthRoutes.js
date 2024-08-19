const router = require('express').Router();
const {loginController, logoutController} = require('../controllers/user/authController');
const { authorization } = require('../middlewares/auth/authorization');
const runValidation = require('../validators');
const { validateLogin } = require('../validators/user/auth');
 

router.post('/login',validateLogin,runValidation,loginController);
router.post('/logout',authorization,logoutController);
module.exports = router;