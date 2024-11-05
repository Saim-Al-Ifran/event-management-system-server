const { getAllFeedback, sendMessageController } = require('../controllers/contact/contactController');
const paginationMiddleware = require('../middlewares/paginationMiddleware');

const router  = require('express').Router();

router.get('/feedback', paginationMiddleware, getAllFeedback);
router.post('/send-message', sendMessageController);
 
module.exports = router;