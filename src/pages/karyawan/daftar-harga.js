// src/pages/karyawan/daftar-harga.js
import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export default function DaftarHarga() {
  const [produk, setProduk] = useState([]);
  const [cari, setCari] = useState('');

  useEffect(() => {
    fetchProduk();
  }, []);

  const fetchProduk = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'produk'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProduk(data);
    } catch (error) {
      console.error('Gagal mengambil data produk:', error);
    }
  };

  const filteredProduk = produk.filter(item =>
    item.nama.toLowerCase().includes(cari.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-300">📋 Daftar Harga Produk</h1>

        <input
          type="text"
          placeholder="🔍 Cari produk..."
          className="w-full md:w-1/3 mb-6 p-3 rounded-md bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={cari}
          onChange={(e) => setCari(e.target.value)}
        />

        {filteredProduk.length === 0 ? (
          <p className="text-center text-gray-400 mt-8">Produk tidak ditemukan.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-600">
            <table className="min-w-full table-auto text-left text-gray-200">
              <thead className="bg-indigo-700">
                <tr>
                  <th className="px-6 py-3">Nama Produk</th>
                  <th className="px-6 py-3">Kategori</th>
                  <th className="px-6 py-3">Harga (Rp)</th>
                  <th className="px-6 py-3">Stok</th>
                </tr>
              </thead>
              <tbody>
                {filteredProduk.map((item) => (
                  <tr key={item.id} className="border-b border-gray-700 hover:bg-indigo-800 transition">
                    <td className="px-6 py-4 font-medium">{item.nama}</td>
                    <td className="px-6 py-4">{item.kategori}</td>
                    <td className="px-6 py-4">Rp{item.harga?.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">{item.stok ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
