const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Veritabanı bağlantısı
let db = new sqlite3.Database('../turkiye.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('SQLite veritabanına başarıyla bağlandı.');
});

// Mahalle tablosunu oluşturma ve JSON verilerini import etme
db.serialize(() => {
    // Mahalle tablosunu oluştur
    db.run(`
        CREATE TABLE IF NOT EXISTS mahalle (
            mahalle_id INTEGER PRIMARY KEY,
            mahalle_adi TEXT,
            ilce_id INTEGER,
            ilce_adi TEXT,
            sehir_id INTEGER,
            sehir_adi TEXT
        )
    `, (err) => {
        if (err) {
            console.error("Mahalle tablosu oluşturulurken hata oluştu:", err.message);
        } else {
            console.log('Mahalle tablosu başarıyla oluşturuldu ya da zaten mevcut.');
        }
    });

    // JSON dosyasını okuyup veritabanına ekle
    fs.readFile('../data/mahalle.json', 'utf8', (err, data) => {
        if (err) {
            console.error('JSON dosyası okunamadı:', err);
            return;
        }

        // JSON verisini parse et
        const mahalleler = JSON.parse(data);

        // Verileri mahalle tablosuna ekle
        const stmt = db.prepare(`
            INSERT INTO mahalle (mahalle_id, mahalle_adi, ilce_id, ilce_adi, sehir_id, sehir_adi) 
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        mahalleler.forEach((mahalle) => {
            stmt.run(mahalle.mahalle_id, mahalle.mahalle_adi, mahalle.ilce_id, mahalle.ilce_adi, mahalle.sehir_id, mahalle.sehir_adi, (err) => {
                if (err) {
                    console.error(`Mahalle ${mahalle.mahalle_adi} eklenirken hata oluştu:`, err.message);
                } else {
                    console.log(`Mahalle ${mahalle.mahalle_adi} başarıyla eklendi.`);
                }
            });
        });

        stmt.finalize(() => {
            console.log('Tüm mahalle verileri başarıyla eklendi.');

            // Veritabanı bağlantısını işlemler tamamlandıktan sonra kapatma
            db.close((err) => {
                if (err) {
                    console.error('Veritabanı kapatılırken hata oluştu:', err.message);
                } else {
                    console.log('Veritabanı bağlantısı başarıyla kapatıldı.');
                }
            });
        });
    });
});
