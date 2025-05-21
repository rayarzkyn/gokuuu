import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../firebase/config';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function RekapHarianKaryawan() {
  const router = useRouter();
  const [produkData, setProdukData] = useState([]);
  const [tanggal, setTanggal] = useState('');
  const [emailPengguna, setEmailPengguna] = useState('');

  // Ambil data dari localStorage + user email dari Firebase Auth
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('stokHarianData'));
    if (storedData) {
      setTanggal(storedData.tanggal);
      setProdukData(storedData.produkData || []);
    }

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmailPengguna(user.email);
      } else {
        setEmailPengguna('Tidak diketahui');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataTerjual = produkData.filter((data) => data.jumlahTerjual > 0);

    if (dataTerjual.length === 0) {
      alert('Tidak ada produk yang terjual untuk dikirim.');
      return;
    }

    try {
      // Simpan ke rekapHarian
      for (let data of dataTerjual) {
        const harga = Number(data.harga) || 0;
        const total = Number(data.jumlahTerjual) * harga;

        await addDoc(collection(db, 'rekapHarian'), {
          tanggal: new Date(tanggal),
          produk: data.namaProduk,
          jumlahTerjual: data.jumlahTerjual,
          harga,
          total,
          emailPengguna,
        });
      }

      // Simpan ke stokHarian agar bisa dibaca oleh kepala/rekap.js
      await addDoc(collection(db, 'stokHarian'), {
        tanggal,
        produkData: produkData.map(p => ({
          namaProduk: p.namaProduk,
          jumlahStokAwal: p.jumlahStokAwal || 0,
          jumlahStokAkhir: p.jumlahStokAkhir || 0,
        })),
      });

      localStorage.removeItem('stokHarianData');
      router.push('/karyawan');
    } catch (error) {
      console.error('Gagal menyimpan data rekap:', error);
      alert('Gagal menyimpan data. Silakan coba lagi.');
    }
  };

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
                  <th className="px-4 py-2">Harga</th>
                  <th className="px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {produkData.filter(prod => prod.jumlahTerjual > 0).map((produk, index) => {
                  const harga = Number(produk.harga) || 0;
                  const total = Number(produk.jumlahTerjual) * harga;

                  return (
                    <tr key={index}>
                      <td className="px-4 py-2">{produk.namaProduk}</td>
                      <td className="px-4 py-2">{produk.jumlahTerjual}</td>
                      <td className="px-4 py-2">Rp {harga.toLocaleString('id-ID')}</td>
                      <td className="px-4 py-2">Rp {total.toLocaleString('id-ID')}</td>
                    </tr>
                  );
                })}
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
