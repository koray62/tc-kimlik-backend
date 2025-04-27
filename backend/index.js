const express = require('express');
const cors = require('cors');
const app = express();  // <-- app tanımlanıyor
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/dogrula', (req, res) => {
  const { tcNo, ad, soyad, dogumYili } = req.body;

  // Doğru olması gereken bilgiler
  const dogruBilgiler = {
    tcNo: '10000000146',
    ad: 'Ali',
    soyad: 'Veli',
    dogumYili: '1990'
  };

  if (
    tcNo === dogruBilgiler.tcNo &&
    ad.trim().toLowerCase() === dogruBilgiler.ad.toLowerCase() &&
    soyad.trim().toLowerCase() === dogruBilgiler.soyad.toLowerCase() &&
    dogumYili === dogruBilgiler.dogumYili
  ) {
    return res.json({ dogrulama: true });
  } else {
    return res.json({ dogrulama: false });
  }
});

app.get('/', (req, res) => {
  res.send('TC Kimlik No Doğrulama Backend Çalışıyor ✅');
});

app.listen(port, () => {
  console.log(`Server çalışıyor: ${port}`);
});
