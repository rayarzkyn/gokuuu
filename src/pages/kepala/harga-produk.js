import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../firebase/config';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

export default function HargaProduk() {
  const router = useRouter();
  const [produkList, setProdukList] = useState([]);
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [editId, setEditId] = useState(null);

  const produkCollection = collection(db, 'produkHarga');

  useEffect(() => {
    const q = query(produkCollection, orderBy('nama'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProdukList(list);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async () => {
    if (!nama.trim() || !harga || isNaN(harga)) {
      alert('Nama dan harga harus valid');
      return;
    }

    const hargaNumber = Number(harga);

    try {
      if (editId) {
        const prodDoc = doc(db, 'produkHarga', editId);
        await updateDoc(prodDoc, { nama, harga: hargaNumber });
      } else {
        await addDoc(produkCollection, { nama, harga: hargaNumber });
      }
      setNama('');
      setHarga('');
      setEditId(null);
    } catch (error) {
      console.error("Terjadi kesalahan saat menyimpan data:", error);
    }
  };

  const handleEdit = (prod) => {
    setNama(prod.nama);
    setHarga(prod.harga.toString());
    setEditId(prod.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin hapus produk ini?')) {
      try {
        await deleteDoc(doc(db, 'produkHarga', id));
      } catch (error) {
        console.error("Gagal menghapus produk:", error);
      }
    }
  };

  const handleCancel = () => {
    setNama('');
    setHarga('');
    setEditId(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-blue-300 via-blue-700 to-purple-600">
      {/* Tombol kembali di pojok kanan atas */}
      <main className="flex-grow p-6 sm:p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-700 mb-6">
            Kelola Harga Produk
          </h1>

          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="text"
              placeholder="Nama Produk"
              value={nama}
              onChange={e => setNama(e.target.value)}
              className="border rounded px-4 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="number"
              placeholder="Harga Produk"
              value={harga}
              onChange={e => setHarga(e.target.value)}
              className="border rounded px-4 py-2 w-full sm:w-36 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              onClick={handleAdd}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              {editId ? 'Update' : 'Tambah'}
            </button>
            {editId && (
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Batal
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-200 text-blue-800">
                  <th className="border border-gray-300 px-4 py-2 text-left">Nama Produk</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Harga</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {produkList.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4">Belum ada produk.</td>
                  </tr>
                ) : (
                  produkList.map(prod => (
                    <tr key={prod.id} className="hover:bg-blue-50">
                      <td className="border border-gray-300 px-4 py-2">{prod.nama}</td>
                      <td className="border border-gray-300 px-4 py-2">Rp {prod.harga.toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(prod)}
                          className="bg-yellow-500 px-3 py-1 rounded text-white hover:bg-yellow-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700 transition"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => router.push('/kepala')}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
            >
              Kembali ke Dashboard
            </button>
        </div>
        </div>
      </main>

      <footer className="bg-black text-white py-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Raya Rikyana. All rights reserved.</p>
        <p className="mt-2 text-sm">
          Developed with by{' '}
          <a
            href="https://github.com/your-profile"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Raya Rizkyana
          </a>
        </p>
      </footer>
    </div>
  );
}
