const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');

router.post('/download', siteController.down);
router.use('/', siteController.home);

module.exports = router;
