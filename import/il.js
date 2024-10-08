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
fs.readFile('../data/il.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const ilData = JSON.parse(data);

    db.serialize(() => {
        // 'il' tablosunu oluşturma
        db.run(`CREATE TABLE IF NOT EXISTS il (
            sehir_id INTEGER PRIMARY KEY,
            sehir_adi TEXT NOT NULL
        )`);

        // Verileri ekleme
        const stmt = db.prepare("INSERT INTO il (sehir_id, sehir_adi) VALUES (?, ?)");
        ilData.forEach(il => {
            stmt.run(il.sehir_id, il.sehir_adi);
        });
        stmt.finalize();//sorguyu kapatmaya yarar

          // Veritabanı bağlantısını kapatma (en son burada kapatıyoruz)
          db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Veritabanı bağlantısı kapatıldı.');
        });

        // Veritabanından verileri çekme
        // db.all("SELECT * FROM il", [], (err, rows) => {
        //     if (err) {
        //         throw err;
        //     }
        //     // Verileri konsola yazdır
        //     rows.forEach((row) => {
        //         console.log(`${row.sehir_id}: ${row.sehir_adi}`);
        //     });

          
        // });
    });
});
