const { getDashboardData } = require('../controllers/dashboard/dashboardController');
const { authenticate } = require('../middlewares/auth/authenticate');
const checkAdminOrSuperAdmin = require('../middlewares/auth/checkAdminOrSuperAdmin');

const router  = require('express').Router();

//router.get('/',authenticate,checkAdminOrSuperAdmin,getDashboardData);
router.get('/',getDashboardData);

module.exports = router;