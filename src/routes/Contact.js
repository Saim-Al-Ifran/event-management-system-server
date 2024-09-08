const { getAllFeedback } = require('../controllers/contact/contactController');
const { authenticate } = require('../middlewares/auth/authenticate');
const checkAdminOrSuperAdmin = require('../middlewares/auth/checkAdminOrSuperAdmin');
const paginationMiddleware = require('../middlewares/paginationMiddleware');

const router  = require('express').Router();

router.get('/feedback', paginationMiddleware, getAllFeedback);
 
module.exports = router;