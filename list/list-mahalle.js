const sqlite3 = require('sqlite3').verbose();

// Veritabanı bağlantısı
let db = new sqlite3.Database('../turkiye.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('SQLite veritabanına başarıyla bağlandı.');
});

// Mahalle verilerini listeleme
db.serialize(() => {
    db.all(`SELECT * FROM mahalle`, [], (err, rows) => {
        if (err) {
            console.error(err.message);
        }

        // Her bir mahalle kaydını yazdır
        rows.forEach((row) => {
            console.log(`${row.mahalle_id} - ${row.mahalle_adi} - İlçe: ${row.ilce_adi} - Şehir: ${row.sehir_adi}`);
        });
    });
});

// Veritabanı bağlantısını kapatma
db.close((err) => {
    if (err) {
        console.error('Veritabanı kapatılırken hata oluştu:', err.message);
    } else {
        console.log('Veritabanı bağlantısı başarıyla kapatıldı.');
    }
});
