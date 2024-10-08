const sqlite3 = require('sqlite3').verbose();

// Veritabanı bağlantısı
let db = new sqlite3.Database('../turkiye.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('SQLite veritabanına başarıyla bağlandı.');
});

// İlçeleri veritabanından çekme ve görüntüleme
db.serialize(() => {
    db.all("SELECT * FROM ilce", [], (err, rows) => {
        if (err) {
            throw err;
        }
        // Verileri konsola yazdır
        rows.forEach((row) => {
            console.log(`${row.ilce_id}: ${row.ilce_adi}, Şehir: ${row.sehir_adi}`);
        });
    });
});

// Veritabanı bağlantısını kapatma
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Veritabanı bağlantısı kapatıldı.');
});
