const exxpress = require('express');

const router = exxpress.Router();

const SearchController = require('../controllers/search');

router.post('/quick', SearchController.quickSearch);
router.post('/advanced', SearchController.advancedSearch);

module.exports = router;