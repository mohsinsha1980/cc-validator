const express = require('express');
const routes = express.Router();

const ctrl = require('../controller/controller');

routes.route('/validate').post(ctrl.validateCCNumber);

module.exports = routes;