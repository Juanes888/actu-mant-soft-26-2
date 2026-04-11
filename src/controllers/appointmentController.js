const OwnerModel = require('../models/ownerModel');
const PetModel = require('../models/petModel');
const AppointmentModel = require('../models/appointmentModel');

exports.getAllAppointments = (req, res) => {
    AppointmentModel.getAll((err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.render('index', { title: 'Panel de Citas', appointments: rows });
    });
};

exports.getCreateForm = (req, res) => {
    res.render('create', { title: 'Agendar Nueva Cita' });
};

exports.createAppointment = (req, res) => {
    const { 
        owner_name, 
        owner_phone, 
        pet_name, 
        service, 
        appointment_date,
        weight,
        temperature,
        diagnosis,
        medicine
    } = req.body;

    const proceedWithOwner = (ownerId) => {
        PetModel.create(ownerId, pet_name, (err, petId) => {
            if (err) return res.status(500).send(err.message);
            
            AppointmentModel.create(
                petId, 
                service, 
                appointment_date, 
                weight, 
                temperature, 
                diagnosis, 
                medicine,
                (err) => {
                    if (err) return res.status(500).send(err.message);
                    res.redirect('/');
                }
            );
        });
    };

    OwnerModel.findByNameAndPhone(owner_name, owner_phone, (err, owner) => {
        if (err) return res.status(500).send(err.message);

        if (owner) {
            proceedWithOwner(owner.id);
        } else {
            OwnerModel.create(owner_name, owner_phone, (err, newId) => {
                if (err) return res.status(500).send(err.message);
                proceedWithOwner(newId);
            });
        }
    });
};

exports.deleteAppointment = (req, res) => {
    AppointmentModel.delete(req.params.id, (err) => {
        if (err) return res.status(500).send(err.message);
        res.redirect('/');
    });
};

exports.getHistory = (req, res) => {
    const petId = req.params.petId;
    AppointmentModel.getByPetId(petId, (err, rows) => {
        if (err) return res.status(500).send(err.message);
        const petName = rows.length > 0 ? rows[0].pet_name : 'Mascota';
        res.render('history', { title: `Historial Clínico de ${petName}`, appointments: rows });
    });
};