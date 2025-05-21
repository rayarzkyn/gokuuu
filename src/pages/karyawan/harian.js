import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../../firebase/config';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function StokHarian() {
  const router = useRouter();
  const [tanggal, setTanggal] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [produkList, setProdukList] = useState([]);
  const [form, setForm] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserEmail(user.email);
      else setUserEmail('Tidak diketahui');
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const produkCollection = collection(db, 'produkHarga');
    const q = query(produkCollection, orderBy('nama'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        nama: doc.data().nama,
        harga: Number(doc.data().harga) || 0,
      }));
      setProdukList(list);

      setForm(prevForm => {
        const updatedForm = { ...prevForm };
        list.forEach(prod => {
          if (!updatedForm[prod.nama]) {
            updatedForm[prod.nama] = {
              harga: prod.harga,
              jumlahStokAwal: 0,
              jumlahStokAkhir: 0,
              jumlahTerjual: 0,
              total: 0,
            };
          }
        });
        return updatedForm;
      });
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e, produk, type) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setForm(prevForm => {
      const updated = { ...prevForm };
      if (type === 'stokAwal') updated[produk].jumlahStokAwal = value;
      else if (type === 'stokAkhir') updated[produk].jumlahStokAkhir = value;

      const jumlahTerjual = Math.max(0, updated[produk].jumlahStokAwal - updated[produk].jumlahStokAkhir);
      const hargaProd = produkList.find(p => p.nama === produk)?.harga || 0;

      updated[produk].jumlahTerjual = jumlahTerjual;
      updated[produk].harga = hargaProd;
      updated[produk].total = jumlahTerjual * hargaProd;

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tanggal) {
      alert("Tanggal harus diisi!");
      return;
    }

    const formattedData = Object.keys(form).map(namaProduk => ({
      namaProduk,
      harga: form[namaProduk].harga || 0,
      jumlahStokAwal: form[namaProduk].jumlahStokAwal || 0,
      jumlahStokAkhir: form[namaProduk].jumlahStokAkhir || 0,
      jumlahTerjual: form[namaProduk].jumlahTerjual || 0,
      total: form[namaProduk].total || 0,
    }));

    const data = {
      tanggal,
      userEmail,
      produkData: formattedData,
      createdAt: new Date(),
    };

    try {
      // Simpan data ke Firestore
      await addDoc(collection(db, 'stokHarian'), data);

      // Simpan data juga ke localStorage supaya bisa dibawa ke halaman rekap-harian.js
      localStorage.setItem('stokHarianData', JSON.stringify({ tanggal, produkData: formattedData }));

      router.push('/karyawan/rekap-harian');
    } catch (error) {
      console.error("Gagal menyimpan ke Firestore:", error);
      alert("Terjadi kesalahan saat menyimpan. Silakan coba lagi.");
    }
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
                onChange={e => setTanggal(e.target.value)}
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
                  <th className="px-4 py-2">Harga</th>
                  <th className="px-4 py-2">Stok Awal</th>
                  <th className="px-4 py-2">Stok Akhir</th>
                  <th className="px-4 py-2">Jumlah Terjual</th>
                  <th className="px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {produkList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4">Loading produk...</td>
                  </tr>
                )}
                {produkList.map(prod => (
                  <tr key={prod.id} className="bg-black/20 hover:bg-black/30">
                    <td className="px-4 py-2 font-medium">{prod.nama}</td>
                    <td className="px-4 py-2">Rp {prod.harga.toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        value={form[prod.nama]?.jumlahStokAwal || 0}
                        onChange={e => handleChange(e, prod.nama, 'stokAwal')}
                        className="w-full px-2 py-1 rounded bg-white text-black"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        value={form[prod.nama]?.jumlahStokAkhir || 0}
                        onChange={e => handleChange(e, prod.nama, 'stokAkhir')}
                        className="w-full px-2 py-1 rounded bg-white text-black"
                      />
                    </td>
                    <td className="px-4 py-2">{form[prod.nama]?.jumlahTerjual || 0}</td>
                    <td className="px-4 py-2">
                      Rp {(form[prod.nama]?.total || 0).toLocaleString()}
                    </td>
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
