const router = require('express').Router();
const adminPanelAuth = require('./adminPanelAuthRoutes');
const superAdminRoutes = require('./roleRoutes/superAdminRoutes');
const adminRoutes = require('./roleRoutes/adminRoutes');
const categoryRoutes = require('./categoryRoutes')
const eventRoutes = require('./eventRoutes');
const settingsRoute = require('./settingRoute');
const userDasboardRoute = require('./userDashboard/userRoute');
const userPanelAuth = require('./userDashboard/userPanelAuthRoutes');
const bookingRoute = require('./bookingRoutes/bookingRoutes');
const contactRoute = require('./Contact');

router.use('/api/v1/event-administration',adminPanelAuth);
router.use('/api/v1/event-administration',superAdminRoutes);
router.use('/api/v1/event-administration/admin',adminRoutes);
router.use('/api/v1/event-administration/categories',categoryRoutes);
router.use('/api/v1/event-administration/events', eventRoutes);
router.use('/api/v1/event-administration/settings',settingsRoute); 
router.use('/api/v1/event-administration/contact',contactRoute); 
router.use('/api/v1/event-management',userPanelAuth); 
router.use('/api/v1/user-dasboard/user',userDasboardRoute); 
router.use('/api/v1/event-management/events',bookingRoute); 

module.exports = router;

