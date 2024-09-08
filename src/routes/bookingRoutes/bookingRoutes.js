const router = require('express').Router();
const { bookEvent, getBookingsForUser, requestBookingCancellation, getAllBookings } = require('../../controllers/booking/bookingController');
const {authenticate} = require('../../middlewares/auth/authenticate');
const authorizeUser = require('../../middlewares/auth/authorizeUser');
const paginationMiddleware = require('../../middlewares/paginationMiddleware');

router.get('/bookings', authenticate, authorizeUser , getBookingsForUser);
router.get('/all_bookings',paginationMiddleware,getAllBookings);
router.post('/:eventId/book',authenticate,authorizeUser,bookEvent); 
router.patch('/bookings/:bookingId/request-cancellation',authenticate,authorizeUser,requestBookingCancellation);

module.exports = router;