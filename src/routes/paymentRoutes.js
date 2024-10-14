const { createPaymentIntent,confirmPayment } = require('../controllers/payment/paymentController');
const { authenticate } = require('../middlewares/auth/authenticate');

const router = require('express').Router();

router.post('/create-payment-intent',authenticate,createPaymentIntent);
router.post('/confirm-payment',authenticate,confirmPayment);
module.exports = router;