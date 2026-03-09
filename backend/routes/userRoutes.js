const express = require('express');
const router = express.Router();
const { updateUserProfile, getUserListings } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile').put(protect, updateUserProfile);
router.route('/my-listings').get(protect, getUserListings);

module.exports = router;
