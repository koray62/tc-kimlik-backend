import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [tcNo, setTcNo] = useState('');
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [dogumYili, setDogumYili] = useState('');
  const [sonuc, setSonuc] = useState(null);
  const [hata, setHata] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidTcKimlik = (tc) => {
    if (!/^[1-9][0-9]{10}$/.test(tc)) {
      return false;
    }
    const digits = tc.split('').map(Number);
    const sumOdd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const sumEven = digits[1] + digits[3] + digits[5] + digits[7];
    const digit10 = ((sumOdd * 7) - sumEven) % 10;
    if (digit10 !== digits[9]) {
      return false;
    }
    const sumAll = digits.slice(0, 10).reduce((acc, val) => acc + val, 0);
    const digit11 = sumAll % 10;
    if (digit11 !== digits[10]) {
      return false;
    }
    return true;
  };

  const validateForm = () => {
    if (!isValidTcKimlik(tcNo)) {
      setHata('Geçerli bir TC Kimlik No giriniz.');
      return false;
    }
    if (!/^[A-Za-zÇĞİÖŞÜçğıöşü\s]+$/.test(ad)) {
      setHata('Ad sadece harflerden oluşmalıdır.');
      return false;
    }
    if (!/^[A-Za-zÇĞİÖŞÜçğıöşü\s]+$/.test(soyad)) {
      setHata('Soyad sadece harflerden oluşmalıdır.');
      return false;
    }
    if (!/^\d{4}$/.test(dogumYili) || Number(dogumYili) < 1900 || Number(dogumYili) > new Date().getFullYear()) {
      setHata('Geçerli bir doğum yılı giriniz.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSonuc(null);
    setHata('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://tc-kimlik-backend-production.up.railway.app/api/dogrula', {
        tcNo,
        ad,
        soyad,
        dogumYili
      });

      setSonuc(response.data.dogrulama);
    } catch (error) {
      setHata('Doğrulama sırasında bir hata oluştu.');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>TC Kimlik No Doğrulama</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="TC Kimlik No"
            value={tcNo}
            onChange={(e) => setTcNo(e.target.value)}
            maxLength="11"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Ad"
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Soyad"
            value={soyad}
            onChange={(e) => setSoyad(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="number"
            placeholder="Doğum Yılı"
            value={dogumYili}
            onChange={(e) => setDogumYili(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
          disabled={loading}
        >
          {loading ? 'Doğrulanıyor...' : 'Doğrula'}
        </button>
      </form>

      {loading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div className="spinner" style={{ fontSize: '24px' }}>⏳</div>
        </div>
      )}

      {sonuc !== null && !loading && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          {sonuc ? <p style={{ color: 'green' }}>✅ Doğrulama başarılı!</p> : <p style={{ color: 'red' }}>❌ Doğrulama başarısız.</p>}
        </div>
      )}

      {hata && !loading && (
        <div style={{ marginTop: '20px', color: 'red', textAlign: 'center' }}>
          <p>{hata}</p>
        </div>
      )}
    </div>
  );
}

export default App;
