const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Veritabanı bağlantısı
let db = new sqlite3.Database('../turkiye.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('SQLite veritabanına başarıyla bağlandı.');
});

// JSON dosyasını okuma ve veritabanına ekleme işlemi
fs.readFile('../data/ilce.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const ilceData = JSON.parse(data);

    db.serialize(() => {
        // 'ilce' tablosunu oluşturma
        db.run(`CREATE TABLE IF NOT EXISTS ilce (
            ilce_id INTEGER PRIMARY KEY,
            ilce_adi TEXT NOT NULL,
            sehir_id INTEGER NOT NULL,
            sehir_adi TEXT NOT NULL
        )`);

        // Verileri ekleme
        const stmt = db.prepare("INSERT INTO ilce (ilce_id, ilce_adi, sehir_id, sehir_adi) VALUES (?, ?, ?, ?)");
        ilceData.forEach(ilce => {
            stmt.run(ilce.ilce_id, ilce.ilce_adi, ilce.sehir_id, ilce.sehir_adi);
        });
        stmt.finalize();

        // Veritabanından verileri çekme
        db.all("SELECT * FROM ilce", [], (err, rows) => {
            if (err) {
                throw err;
            }
             // Verileri konsola yazdır
            // rows.forEach((row) => {
            //     console.log(`${row.ilce_id}: ${row.ilce_adi}, Şehir: ${row.sehir_adi}`);
            // });

            // Veritabanı bağlantısını kapatma
            db.close((err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('Veritabanı bağlantısı kapatıldı.');
            });
        });
    });
});
