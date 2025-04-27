const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/dogrula', (req, res) => {
  const { tcNo } = req.body;

  if (tcNo === '10000000146') {
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
