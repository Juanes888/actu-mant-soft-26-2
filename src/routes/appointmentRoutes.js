const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/', appointmentController.getAllAppointments);
router.get('/create', appointmentController.getCreateForm);
router.post('/create', appointmentController.createAppointment);
router.post('/delete/:id', appointmentController.deleteAppointment);
router.get('/history/:petId', appointmentController.getHistory);

module.exports = router;
