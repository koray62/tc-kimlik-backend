import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './App.css'; // CSS dosyamızı import ediyoruz

function App() {
  const [tcNo, setTcNo] = useState('');
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [dogumYili, setDogumYili] = useState('');
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
    return digit11 === digits[10];
  };

  const validateForm = () => {
    if (!isValidTcKimlik(tcNo)) {
      Swal.fire('Hata', 'Geçerli bir TC Kimlik No giriniz.', 'warning');
      return false;
    }
    if (!/^[A-Za-zÇĞİÖŞÜçğıöşü\s]+$/.test(ad)) {
      Swal.fire('Hata', 'Ad sadece harflerden oluşmalıdır.', 'warning');
      return false;
    }
    if (!/^[A-Za-zÇĞİÖŞÜçğıöşü\s]+$/.test(soyad)) {
      Swal.fire('Hata', 'Soyad sadece harflerden oluşmalıdır.', 'warning');
      return false;
    }
    if (!/^\d{4}$/.test(dogumYili) || Number(dogumYili) < 1900 || Number(dogumYili) > new Date().getFullYear()) {
      Swal.fire('Hata', 'Geçerli bir doğum yılı giriniz.', 'warning');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      if (response.data.dogrulama) {
        Swal.fire('Başarılı', 'Doğrulama başarılı!', 'success');
      } else {
        Swal.fire('Başarısız', 'Doğrulama başarısız.', 'error');
      }
    } catch (error) {
      Swal.fire('Hata', 'Doğrulama sırasında bir hata oluştu.', 'error');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="app-background">
      <div className="form-container">
        <h2>TC Kimlik No Doğrulama</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="TC Kimlik No"
            value={tcNo}
            onChange={(e) => setTcNo(e.target.value)}
            maxLength="11"
            required
          />
          <input
            type="text"
            placeholder="Ad"
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Soyad"
            value={soyad}
            onChange={(e) => setSoyad(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Doğum Yılı"
            value={dogumYili}
            onChange={(e) => setDogumYili(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Doğrulanıyor...' : 'Doğrula'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
