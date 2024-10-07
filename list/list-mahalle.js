const sqlite3 = require('sqlite3').verbose();

// Veritabanı bağlantısı
let db = new sqlite3.Database('./turkiye.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('SQLite veritabanına başarıyla bağlandı.');
});

// Mahalleleri görüntüleme
db.all("SELECT * FROM mahalle", [], (err, rows) => {
    if (err) {
        throw err;
    }
    rows.forEach((row) => {
        console.log(`${row.id} | Köy ID: ${row.koy_id} | Mahalle: ${row.name}`);
    });
});


// Veritabanını kapatma
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Veritabanı bağlantısı kapatıldı.');
});
