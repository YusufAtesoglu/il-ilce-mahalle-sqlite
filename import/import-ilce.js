const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// JSON dosyasından ilçeleri okuma
const ilceData = JSON.parse(fs.readFileSync('../data/ilceData.json', 'utf8'));

// Veritabanı bağlantısı
let db = new sqlite3.Database('./turkiye.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('SQLite veritabanına başarıyla bağlandı.');
});

// 'ilce' tablosunu oluşturma
db.run(`CREATE TABLE IF NOT EXISTS ilce (
    id INTEGER PRIMARY KEY,
    il_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY(il_id) REFERENCES il(id)
)`);

// Verileri ekleme
db.serialize(() => {
    const stmt = db.prepare("INSERT INTO ilce (id, il_id, name) VALUES (?, ?, ?)");
    ilceData.forEach(ilce => {
        stmt.run(ilce.id, ilce.il_id, ilce.name);
    });
    stmt.finalize();
});

// Veritabanını kapatma
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Veritabanı bağlantısı kapatıldı.');
});
