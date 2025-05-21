import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

// Produk harga default
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

export default function HargaProduk() {
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
        ...doc.data()
      }));
      setProdukList(list);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async () => {
    if (!nama.trim() || !harga || isNaN(harga)) return alert('Nama dan harga harus valid');
    if (editId) {
      const prodDoc = doc(db, 'produkHarga', editId);
      await updateDoc(prodDoc, {
        nama,
        harga: Number(harga)
      });
      setEditId(null);
    } else {
      await addDoc(produkCollection, {
        nama,
        harga: Number(harga)
      });
    }
    setNama('');
    setHarga('');
  };

  const handleEdit = (prod) => {
    setNama(prod.nama);
    setHarga(prod.harga);
    setEditId(prod.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin hapus produk ini?')) {
      await deleteDoc(doc(db, 'produkHarga', id));
    }
  };

  const handleCancel = () => {
    setNama('');
    setHarga('');
    setEditId(null);
  };

  const handleImportDefault = async () => {
    const existingNames = new Set(produkList.map(p => p.nama));
    const newEntries = Object.entries(hargaProduk).filter(
      ([nama]) => !existingNames.has(nama)
    );

    for (const [nama, harga] of newEntries) {
      await addDoc(produkCollection, { nama, harga });
    }

    alert(`${newEntries.length} produk berhasil ditambahkan!`);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-6 text-center">Kelola Harga Produk</h1>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="text"
            placeholder="Nama Produk"
            value={nama}
            onChange={e => setNama(e.target.value)}
            className="border rounded px-3 py-2 flex-grow"
          />
          <input
            type="number"
            placeholder="Harga Produk"
            value={harga}
            onChange={e => setHarga(e.target.value)}
            className="border rounded px-3 py-2 w-32"
          />
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 rounded hover:bg-green-700 transition"
          >
            {editId ? 'Update' : 'Tambah'}
          </button>
          {editId && (
            <button
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 rounded hover:bg-gray-500 transition"
            >
              Batal
            </button>
          )}
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">Nama Produk</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Harga</th>
              <th className="border border-gray-300 px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {produkList.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4">Belum ada produk.</td>
              </tr>
            )}
            {produkList.map(prod => (
              <tr key={prod.id}>
                <td className="border border-gray-300 px-4 py-2">{prod.nama}</td>
                <td className="border border-gray-300 px-4 py-2">Rp {prod.harga.toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(prod)}
                    className="bg-yellow-500 px-2 py-1 rounded text-white hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id)}
                    className="bg-red-600 px-2 py-1 rounded text-white hover:bg-red-700 transition"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
