const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// JSON verisini dosyadan okuma
let ilData;
try {
    const jsonData = fs.readFileSync('../data/ilData.json', 'utf8');
    ilData = JSON.parse(jsonData);
} catch (err) {
    console.error('Dosya okunamadı:', err);
    return;
}

// Veritabanı bağlantısı
let db = new sqlite3.Database('./turkiye.db', (err) => {
    if (err) {
        console.error('Veritabanına bağlanırken hata oluştu:', err.message);
        return;
    }
    console.log('SQLite veritabanına başarıyla bağlandı.');
});

// 'il' tablosunu oluşturma
db.run(`CREATE TABLE IF NOT EXISTS il (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
)`, (err) => {
    if (err) {
        console.error('Tablo oluşturulurken hata oluştu:', err.message);
    }
});

// Verileri ekleme
db.serialize(() => {
    const stmt = db.prepare("INSERT OR IGNORE INTO il (id, name) VALUES (?, ?)");
    ilData.forEach(il => {
        stmt.run(il.id, il.name);
    });
    stmt.finalize();
});

// Veritabanını kapatma
db.close((err) => {
    if (err) {
        console.error('Veritabanı kapatılırken hata oluştu:', err.message);
    }
    console.log('Veritabanı bağlantısı kapatıldı.');
});
