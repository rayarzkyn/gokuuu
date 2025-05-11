// src/pages/karyawan/rekap-harian.js

import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/router';

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

export default function RekapHarianKaryawan() {
  const router = useRouter();

  const [form, setForm] = useState({});
  const [tanggal, setTanggal] = useState('');
  const [emailPengguna, setEmailPengguna] = useState('');

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('stokHarianData'));
    if (storedData) {
      setTanggal(storedData.tanggal);
      setForm(storedData.formData);
    }

    const email = localStorage.getItem('userEmail'); // Ambil email dari localStorage
    setEmailPengguna(email || 'Tidak diketahui');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (let produk in form) {
        if (form[produk].jumlahTerjual > 0) {
          const harga = hargaProduk[produk] || 0;
          const jumlahTerjual = form[produk].jumlahTerjual;
          const total = jumlahTerjual * harga;

          await addDoc(collection(db, 'rekapHarian'), {
            tanggal: new Date(tanggal), // ✅ Simpan tanggal sesuai input user
            produk,
            jumlahTerjual,
            total,
            harga,
            emailPengguna, // ✅ Simpan email pengguna
          });
        }
      }
      router.push('/karyawan');
    } catch (error) {
      console.error("Error saving data to Firestore: ", error);
    }
  };

  // Format tanggal ke lokal Indonesia
  const formatTanggalLokal = (tglStr) => {
    try {
      return new Date(tglStr).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return tglStr;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white p-8">
      <div className="w-full max-w-xl bg-black/30 p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Rekap Stok Harian</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm">Tanggal: <strong>{formatTanggalLokal(tanggal)}</strong></p>
          <p className="text-sm">Diinput oleh: <strong>{emailPengguna}</strong></p>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left text-sm text-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2">Nama Produk</th>
                  <th className="px-4 py-2">Jumlah Terjual</th>
                  <th className="px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(form).map((produk) => (
                  <tr key={produk}>
                    <td className="px-4 py-2">{produk}</td>
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
            Kirim Laporan
          </button>
        </form>
      </div>
    </div>
  );
}
