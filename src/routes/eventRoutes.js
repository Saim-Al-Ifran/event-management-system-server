const { deleteBookings } = require('../controllers/booking/bookingController');
const {
     createEvent,
     updateEvent,
     duplicateEvent,
     sortEvents,
     getEvents,
     deleteEvent,
     approveEvent
  } = require('../controllers/event/eventController');
  
const { authenticate } = require('../middlewares/auth/authenticate');
const checkAdminOrSuperAdmin = require('../middlewares/auth/checkAdminOrSuperAdmin');
const upload = require('../middlewares/upload');
const runValidation = require('../validators');
const { validateEventFields } = require('../validators/events/eventsValidate');
const paginationMiddleware = require('../middlewares/paginationMiddleware');
const router = require('express').Router();

router.get('/',paginationMiddleware,getEvents);
router.post('/', authenticate,checkAdminOrSuperAdmin, upload.single('image'), validateEventFields , runValidation ,createEvent);
router.put('/:eventId', authenticate , checkAdminOrSuperAdmin , upload.single('image'),validateEventFields , runValidation , updateEvent);
router.delete('/:eventId', authenticate , checkAdminOrSuperAdmin , deleteEvent);
router.post('/:eventId/duplicate' , authenticate ,checkAdminOrSuperAdmin , duplicateEvent);
router.get('/sort', authenticate , checkAdminOrSuperAdmin ,sortEvents);
router.patch('/approve/:eventId',authenticate,checkAdminOrSuperAdmin, approveEvent);
router.delete('/bookings/:bookingId/delete-requested', authenticate, checkAdminOrSuperAdmin, deleteBookings)
;

module.exports = router;