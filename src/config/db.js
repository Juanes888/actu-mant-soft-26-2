const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run('PRAGMA foreign_keys = ON');

    db.run(`CREATE TABLE owners (
        id         INTEGER  PRIMARY KEY AUTOINCREMENT,
        name       TEXT     NOT NULL,
        phone      TEXT     NOT NULL DEFAULT 'Sin teléfono',
        email      TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE pets (
        id         INTEGER  PRIMARY KEY AUTOINCREMENT,
        owner_id   INTEGER  NOT NULL,
        name       TEXT     NOT NULL,
        species    TEXT     NOT NULL DEFAULT 'Perro',
        breed      TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE RESTRICT
    )`);

    db.run(`CREATE TABLE appointments (
        id               INTEGER  PRIMARY KEY AUTOINCREMENT,
        pet_id           INTEGER  NOT NULL,
        service          TEXT     NOT NULL,
        appointment_date TEXT     NOT NULL,
        status           TEXT     DEFAULT 'Scheduled',
        created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE RESTRICT
    )`);


    //TODO: AQUI SE HACE LA MIGRACION 

    const stmtOwners = db.prepare('INSERT INTO owners (name, phone) VALUES (?, ?)');
    stmtOwners.run('Juan Pérez',   '300-000-0001'); 
    stmtOwners.run('Maria García', '300-000-0002'); 
    stmtOwners.finalize();

    const stmtPets = db.prepare('INSERT INTO pets (owner_id, name, species) VALUES (?, ?, ?)');
    stmtPets.run(1, 'Rex',  'Perro'); 
    stmtPets.run(2, 'Luna', 'Perro'); 
    stmtPets.finalize();

    const stmtAppts = db.prepare('INSERT INTO appointments (pet_id, service, appointment_date) VALUES (?, ?, ?)');
    stmtAppts.run(1, 'Corte de Pelo',   '2026-02-25 10:00'); // Rex
    stmtAppts.run(2, 'Baño y Limpieza', '2026-02-25 11:30'); // Luna
    stmtAppts.finalize();

});

module.exports = db;