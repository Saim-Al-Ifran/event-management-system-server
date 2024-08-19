const { getSettings, createOrUpdateSettings } = require('../controllers/settings/settingsController');
const { authenticate } = require('../middlewares/auth/authenticate');
const checkAdminOrSuperAdmin = require('../middlewares/auth/checkAdminOrSuperAdmin');
const upload = require('../middlewares/upload');
const runValidation = require('../validators');
const { validateSettingFields } = require('../validators/settings/settingsValidate');

const router  = require('express').Router();

router.get('/',authenticate,checkAdminOrSuperAdmin,getSettings);
router.post('/',upload.single('image'),authenticate,checkAdminOrSuperAdmin,validateSettingFields,runValidation,createOrUpdateSettings)


module.exports = router;