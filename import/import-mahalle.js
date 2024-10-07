const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Veritabanı bağlantısı
let db = new sqlite3.Database('../turkiye.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('SQLite veritabanına başarıyla bağlandı.');
});

// 'mahalle' tablosunu oluşturma
db.run(`CREATE TABLE IF NOT EXISTS mahalle (
    id INTEGER PRIMARY KEY,
    koy_id INTEGER NOT NULL,
    name TEXT NOT NULL
)`);

// JSON dosyasını okuma
fs.readFile('../data/mahalleData.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    // JSON verisini parse etme
    const mahalleData = JSON.parse(data);

    // Veritabanına mahalle ekleme
    db.serialize(() => {
        const stmt = db.prepare("INSERT INTO mahalle (id, koy_id, name) VALUES (?, ?, ?)");
        mahalleData.forEach(mahalle => {
            stmt.run(mahalle.id, mahalle.koy_id, mahalle.name);
        });
        stmt.finalize();
        console.log("Mahalle verileri başarıyla eklendi.");
    });

    // Veritabanını kapatma
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Veritabanı bağlantısı kapatıldı.');
    });
});
