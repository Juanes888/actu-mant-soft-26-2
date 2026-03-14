const db = require('../config/db');

exports.getAllAppointments = (req, res) => {
    const sql = `
        SELECT
            a.id,
            a.service,
            a.appointment_date,
            a.status,
            p.name  AS pet_name,
            o.name  AS owner_name
        FROM appointments a
        JOIN pets   p ON p.id = a.pet_id
        JOIN owners o ON o.id = p.owner_id
        ORDER BY a.appointment_date DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.render('index', { title: 'Panel de Citas', appointments: rows });
    });
};

exports.getCreateForm = (req, res) => {
    res.render('create', { title: 'Agendar Nueva Cita' });
};


exports.createAppointment = (req, res) => {
    const { owner_name, owner_phone, pet_name, service, appointment_date } = req.body;

    db.get(
        'SELECT id FROM owners WHERE name = ? AND phone = ?',
        [owner_name, owner_phone],
        (err, owner) => {
            if (err) return res.status(500).send(err.message);

            if (owner) {
                crearMascota(owner.id);
            } else {
                db.run(
                    'INSERT INTO owners (name, phone) VALUES (?, ?)',
                    [owner_name, owner_phone],
                    function (err) {
                        if (err) return res.status(500).send(err.message);
                        crearMascota(this.lastID);
                    }
                );
            }
        }
    );

    function crearMascota(ownerId) {
        db.run(
            'INSERT INTO pets (owner_id, name) VALUES (?, ?)',
            [ownerId, pet_name],
            function (err) {
                if (err) return res.status(500).send(err.message);
                crearCita(this.lastID);
            }
        );
    }

    function crearCita(petId) {
        db.run(
            'INSERT INTO appointments (pet_id, service, appointment_date) VALUES (?, ?, ?)',
            [petId, service, appointment_date],
            function (err) {
                if (err) return res.status(500).send(err.message);
                res.redirect('/');
            }
        );
    }
};

exports.deleteAppointment = (req, res) => {
    db.run('DELETE FROM appointments WHERE id = ?', req.params.id, function (err) {
        if (err) return res.status(500).send(err.message);
        res.redirect('/');
    });
};