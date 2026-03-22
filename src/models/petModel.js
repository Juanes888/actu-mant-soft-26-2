const db = require('../config/db');

class PetModel {
  static create(ownerId, name, callback) {
    db.run('INSERT INTO pets (owner_id, name) VALUES (?, ?)', [ownerId, name], function (err) {
        callback(err, this ? this.lastID : null);
    });
  }
}

module.exports = PetModel;