const sqlite3 = require('sqlite3').verbose();

// Veritabanı bağlantısı
let db = new sqlite3.Database('../turkiye.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('SQLite veritabanına başarıyla bağlandı.');
});

// İlçeleri görüntüleme
db.all("SELECT * FROM ilce", [], (err, rows) => {
    if (err) {
        throw err;
    }
    rows.forEach((row) => {
        console.log(`${row.id} | İl ID: ${row.il_id} | İlçe: ${row.name}`);
    });
});

// Veritabanını kapatma
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Veritabanı bağlantısı kapatıldı.');
});
