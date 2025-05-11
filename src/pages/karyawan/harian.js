import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../firebase/config';

const hargaProduk = {
  "Kartu Axis 10GB": 15000,
  "Kartu Smartfren 8GB": 20000,
  "Kartu Telkomsel 20GB": 22000,
  "Kartu Telkomsel 30GB": 30000,
  "Kartu Tri 5GB": 15000,
  "Kartu XL 5GB": 20000,
  "Voucher IM3 4GB": 12000,
  "Voucher IM3 7GB": 20000,
  "Voucher IM3 8GB": 25000,
  "Voucher IM3 12GB": 40000,
  "Voucher IM3 20GB": 60000,
  "Voucher Telkomsel 1.5GB": 9000,
  "Voucher Telkomsel 2.5GB": 12000,
  "Voucher Telkomsel 3.5GB": 15000,
  "Voucher Telkomsel 4.5GB": 20000,
  "Voucher Telkomsel 5.5GB": 25000,
  "Voucher Telkomsel 12GB": 55000,
};

export default function StokHarian() {
  const router = useRouter();
  const [tanggal, setTanggal] = useState('');
  const [userEmail, setUserEmail] = useState(''); // ubah dari userName jadi userEmail
  const [form, setForm] = useState(
    Object.keys(hargaProduk).reduce((acc, produk) => {
      acc[produk] = {
        jumlahStokAwal: 0,
        jumlahStokAkhir: 0,
        jumlahTerjual: 0,
        total: 0,
      };
      return acc;
    }, {})
  );

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email); // simpan email pengguna
    } else {
      setUserEmail('Tidak diketahui');
    }
  }, []);

  const handleChange = (e, produk, type) => {
    const value = parseInt(e.target.value) || 0;
    const updatedForm = { ...form };

    if (type === 'stokAwal') {
      updatedForm[produk].jumlahStokAwal = value;
    } else if (type === 'stokAkhir') {
      updatedForm[produk].jumlahStokAkhir = value;
    }

    updatedForm[produk].jumlahTerjual =
      updatedForm[produk].jumlahStokAwal - updatedForm[produk].jumlahStokAkhir;
    updatedForm[produk].total = hargaProduk[produk] * updatedForm[produk].jumlahTerjual;

    setForm(updatedForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!tanggal) {
      alert("Tanggal harus diisi!");
      return;
    }

    // Simpan data ke localStorage
    const data = {
      tanggal,
      formData: form,
    };

    localStorage.setItem('stokHarianData', JSON.stringify(data));
    localStorage.setItem('userEmail', userEmail); // pastikan nilai userEmail tersimpan

    router.push('/karyawan/rekap-harian');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white p-8">
      <div className="w-full max-w-6xl mx-auto bg-black/30 p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Input Stok Harian</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Tanggal</label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
                className="w-full px-4 py-2 rounded bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Diinput oleh</label>
              <input
                type="text"
                value={userEmail}
                readOnly
                className="w-full px-4 py-2 rounded bg-gray-100 text-black cursor-not-allowed"
              />
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full table-auto text-sm text-gray-300 border border-gray-600">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-2">Nama Produk</th>
                  <th className="px-4 py-2">Stok Awal</th>
                  <th className="px-4 py-2">Stok Akhir</th>
                  <th className="px-4 py-2">Jumlah Terjual</th>
                  <th className="px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(hargaProduk).map((produk) => (
                  <tr key={produk} className="bg-black/20 hover:bg-black/30">
                    <td className="px-4 py-2 font-medium">{produk}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={form[produk].jumlahStokAwal}
                        onChange={(e) => handleChange(e, produk, 'stokAwal')}
                        className="w-full px-2 py-1 rounded bg-white text-black"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={form[produk].jumlahStokAkhir}
                        onChange={(e) => handleChange(e, produk, 'stokAkhir')}
                        className="w-full px-2 py-1 rounded bg-white text-black"
                      />
                    </td>
                    <td className="px-4 py-2">{form[produk].jumlahTerjual}</td>
                    <td className="px-4 py-2">Rp {form[produk].total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 w-full py-2 rounded text-white font-semibold"
          >
            Simpan Stok
          </button>
        </form>
      </div>
    </div>
  );
}
