const mysql = require('mysql2');
require('dotenv').config();

const dbConfig = {
    host: 'mysql-32749a69-meghayareshimi-4b05.b.aivencloud.com',
    port: 26132,
    user: 'avnadmin',
    password: process.env.DB_PASSWORD,
    database: 'defaultdb',
    ssl: {
        rejectUnauthorized: false
    }
};

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
    if (err) {
        console.error('Error:', err);
        process.exit(1);
    }

    // Drop and recreate to be absolutely sure
    db.query('DROP TABLE IF EXISTS users', (err) => {
        if (err) console.error(err);

        const createTableQuery = `
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20)
      )
    `;

        db.query(createTableQuery, (err) => {
            if (err) {
                console.error('Error creating table:', err);
            } else {
                console.log('Users table recreated successfully.');
            }
            db.end();
        });
    });
});
