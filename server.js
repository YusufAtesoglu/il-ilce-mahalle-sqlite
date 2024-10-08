const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// SQLite veritabanı bağlantısı
const db = new sqlite3.Database('./turkiye.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('SQLite veritabanına başarıyla bağlandı.');
    }
});

// İller API'si
app.get('/iller', (req, res) => {
    db.all('SELECT * FROM il', [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Veri alınırken hata oluştu.' });
        }
        res.json(rows);
    });
});

app.get('/iller/:sehir/ilceler', (req, res) => {
    const sehir = req.params.sehir.toLocaleUpperCase('tr-TR'); // Türkçe dönüşüm

    // İlçeleri almak için SQL sorgusu
    db.all('SELECT * FROM ilce WHERE sehir_adi = ?', [sehir], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Veri alınırken hata oluştu.' });
        }
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'İlçeler bulunamadı.' });
        }
        
        res.json(rows);
    });
});


// Mahalleleri getiren API
app.get('/iller/:sehir/ilceler/:ilce/mahalleler', (req, res) => {
    const sehir = req.params.sehir.toLocaleUpperCase('tr-TR'); // Şehir adını büyük harfe çevirin
    const ilce = req.params.ilce.toLocaleUpperCase('tr-TR'); // İlçe adını büyük harfe çevirin
  
    // Mahalleleri sorgulama
    const query = `
      SELECT * FROM mahalle
      WHERE ilce_adi = ? AND sehir_adi = ?
    `;
  
    db.all(query, [ilce, sehir], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      if (rows.length === 0) {
        res.status(404).json({ message: 'Mahalleler bulunamadı.' });
      } else {
        res.json(rows);
      }
    });
  });



// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});

// Veritabanı bağlantısını kapatma 
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Veritabanı kapatılırken hata oluştu:', err.message);
        } else {
            console.log('Veritabanı bağlantısı başarıyla kapatıldı.');
        }
        process.exit(0);
    });
});
