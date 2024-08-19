const router = require('express').Router();
const { bookEvent, getBookingsForUser, requestBookingCancellation } = require('../../controllers/booking/bookingController');
const {authenticate} = require('../../middlewares/auth/authenticate');
const authorizeUser = require('../../middlewares/auth/authorizeUser');

router.get('/bookings', authenticate, authorizeUser , getBookingsForUser);
router.post('/:eventId/book',authenticate,authorizeUser,bookEvent); 
router.patch('/bookings/:bookingId/request-cancellation',authenticate,authorizeUser,requestBookingCancellation);

module.exports = router;