const express = require('express');
const path = require('path');
const router = express.Router();

const adminController = require('../controllers/admin');

const isAuth = require('../midleware/is-auth');

router.get('/addEmployee', isAuth, adminController.getAddEmployee);
router.post('/addEmployee', isAuth, adminController.postEmployee);
router.get('/employees', isAuth, adminController.getEmployees);
router.get('/addWorkingHours/:id', isAuth, adminController.getAddWorkingHours);
router.post('/addWorkingHours', isAuth, adminController.postAddWorkingHours);
router.post('/updateWorkingHours', isAuth, adminController.postUpdateWorkingHours);

module.exports = router;