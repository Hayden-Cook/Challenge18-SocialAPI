const router = require('express').Router();
const userRoutes = require('../api/userRoutes');
const thoughtRoutes = require('../api/thoughtRoutes');

// routes for /api/users
router.use('/users', userRoutes);

// routes for /api/thoughts
router.use('/thoughts', thoughtRoutes);

module.exports = router;