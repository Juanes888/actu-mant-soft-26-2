const db = require('../config/db');

class OwnerModel {
  static findByNameAndPhone(name, phone, callback) {
    db.get('SELECT id FROM owners WHERE name = ? AND phone = ?', [name, phone], callback);
  }

  static create(name, phone, callback) {
    db.run('INSERT INTO owners (name, phone) VALUES (?, ?)', [name, phone], function(err) {
      callback(err, this ? this.lastID : null);
    });
  }
}

module.exports = OwnerModel;