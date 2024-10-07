const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// SQLite veritabanı bağlantısı
let db = new sqlite3.Database('./turkiye.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('SQLite veritabanına başarıyla bağlandı.');
});


// Tüm illeri çekmek için GET isteği
app.get('/iller', (req, res) => {
    const sql = 'SELECT * FROM il';

    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// İllere göre ilçeleri getiren API
app.get('/iller/:ilName/ilceler', (req, res) => {
    const ilName = req.params.ilName.toUpperCase(); // Gelen il adını büyük harfe çeviriyoruz
    const sql = `SELECT ilce.name 
                 FROM ilce 
                 JOIN il ON ilce.il_id = il.id 
                 WHERE il.name = ?`;

    db.all(sql, [ilName], (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }

        if (rows.length === 0) {
            res.status(404).json({"error": "İl bulunamadı veya ilçeleri yok."});
        } else {
            res.json({
                "il": ilName,
                "ilceler": rows.map(row => row.name)
            });
        }
    });
});


// İlçelere göre mahalleleri getiren API
app.get('/iller/:ilName/ilceler/:ilceName/mahalleler', (req, res) => {
    const ilName = req.params.ilName.toUpperCase();      // İl adını büyük harfe çevir
    const ilceName = req.params.ilceName.toUpperCase();  // İlçe adını büyük harfe çevir
    
    const sql = `SELECT mahalle.name AS mahalle 
                 FROM mahalle 
                 JOIN ilce ON mahalle.koy_id = ilce.id 
                 JOIN il ON ilce.il_id = il.id 
                 WHERE il.name = ? AND ilce.name = ?`;

    db.all(sql, [ilName, ilceName], (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }

        if (rows.length === 0) {
            res.status(404).json({"error": "İlçe veya mahalle bulunamadı."});
        } else {
            res.json({
                "il": ilName,
                "ilce": ilceName,
                "mahalleler": rows.map(row => row.mahalle)
            });
        }
    });
});

// Sunucu dinlemeye başlar
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});
