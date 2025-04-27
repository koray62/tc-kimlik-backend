import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './App.css'; // İstersen ayrı css dosyasına alabiliriz.

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
<div className="form-container">
  <div>
    <h2>TC Kimlik No Doğrulama</h2>
    <form onSubmit={handleSubmit}>
      ... (form elemanları burada)
    </form>
  </div>
</div>

const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '10px 0',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '16px',
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  cursor: 'pointer',
  marginTop: '10px'
};

export default App;
