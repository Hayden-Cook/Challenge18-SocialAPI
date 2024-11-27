// This file sets up the server and connects to the database
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

mongoose.connect('mongodb://localhost/socialsDB').then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => console.error('Connection Error', err));