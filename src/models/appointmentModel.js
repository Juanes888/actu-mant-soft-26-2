const db = require('../config/db');

class AppointmentModel {
  static getAll(callback) {
    const sql = `
        SELECT
            a.id,
            a.service,
            a.appointment_date,
            a.status,
            a.weight,
            a.temperature,
            a.diagnosis,
            p.name  AS pet_name,
            o.name  AS owner_name
        FROM appointments a
        JOIN pets   p ON p.id = a.pet_id
        JOIN owners o ON o.id = p.owner_id
        ORDER BY a.appointment_date DESC
    `;
    db.all(sql, [], callback);
  }

  static create(petId, service, appointment_date, weight, temperature, diagnosis, callback) {
    const sql = `
      INSERT INTO appointments (pet_id, service, appointment_date, weight, temperature, diagnosis)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(sql, [petId, service, appointment_date, weight, temperature, diagnosis], function(err) {
        callback(err, this ? this.lastID : null);
    });
  }

  static delete(id, callback) {
    db.run('DELETE FROM appointments WHERE id = ?', [id], callback);
  }
}

module.exports = AppointmentModel;