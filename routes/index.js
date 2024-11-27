// Entry point for API routes. This file will import all of the API routes and package them up for us.
const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

module.exports = router;