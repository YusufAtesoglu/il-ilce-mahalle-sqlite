const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('../turkiye.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('SQLite veritabanına başarıyla bağlandı.');
});

// İllerin listelenmesi
db.all("SELECT * FROM il", [], (err, rows) => {
    if (err) {
        throw err;
    }
    rows.forEach((row) => {
        console.log(`${row.id}: ${row.name}`);
    });
});

// Veritabanını kapatma
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Veritabanı bağlantısı kapatıldı.');
});
