// src/pages/karyawan/daftar-harga.js
import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/router';

export default function DaftarHarga() {
  const [produk, setProduk] = useState([]);
  const [cari, setCari] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProduk();
  }, []);

  const fetchProduk = async () => {
    try {
      const q = query(collection(db, 'produkHarga'), orderBy('nama'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProduk(data);
    } catch (error) {
      console.error('Gagal mengambil data harga produk:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProduk = produk.filter(item =>
    item.nama.toLowerCase().includes(cari.toLowerCase())
  );

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-950 text-white p-8 flex flex-col">
        <div className="max-w-6xl mx-auto w-full flex-grow">
          {/* Header */}
          <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">💰 Daftar Harga Produk</h1>

          {/* Input Cari */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <input
              type="text"
              placeholder="🔍 Cari produk..."
              className="w-full md:w-1/3 p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={cari}
              onChange={(e) => setCari(e.target.value)}
            />

            <button
              onClick={() => router.push('/karyawan')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-5 rounded-md shadow-md transition"
            >
              ⬅️ Kembali
            </button>
          </div>

          {/* Table atau Loading */}
          {loading ? (
            <p className="text-center text-gray-400 mt-10">Memuat data harga produk...</p>
          ) : filteredProduk.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">Produk tidak ditemukan.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-700 bg-white text-black">
              <table className="min-w-full table-auto text-left">
                <thead className="bg-yellow-500 text-black">
                  <tr>
                    <th className="px-6 py-3">Nama Produk</th>
                    <th className="px-6 py-3">Harga (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProduk.map((item) => (
                    <tr key={item.id} className="border-b border-gray-300 hover:bg-yellow-100 transition">
                      <td className="px-6 py-4 font-semibold">{item.nama}</td>
                      <td className="px-6 py-4">
                        Rp {item.harga?.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <footer className="w-full bg-yellow-500 text-black py-6 text-center text-sm">
  <p className="font-semibold">&copy; {new Date().getFullYear()} Raya Rikyana. All rights reserved.</p>
  <p className="mt-2 font-semibold">
    Developed with by{' '}
    <a
      href="https://github.com/your-profile"
      className="text-blue-800 hover:underline font-bold"
      target="_blank"
      rel="noopener noreferrer"
    >
      Raya Rizkyana
    </a>
  </p>
</footer>
    </>
  );
}
