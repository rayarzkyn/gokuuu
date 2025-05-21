import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
  query,
} from 'firebase/firestore';

export default function LihatLaporan() {
  const [laporan, setLaporan] = useState([]);
  const [cari, setCari] = useState('');
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const q = query(collection(db, 'rekapHarian'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => {
      const docData = doc.data();

      const harga = Number(docData.harga || 0);
      const jumlahTerjual = Number(docData.jumlahTerjual || 0);
      const total = jumlahTerjual * harga;

      return {
        id: doc.id,
        produk: docData.produk || 'Tidak diketahui',
        jumlahTerjual,
        harga,
        total,
        tanggal: docData.tanggal?.toDate?.() ?? docData.tanggal,
        emailPengguna: docData.emailPengguna || 'Tidak diketahui',
      };
    });

    const sorted = data.sort((a, b) => {
      const dateA = new Date(a.tanggal);
      const dateB = new Date(b.tanggal);
      if (dateA.getTime() !== dateB.getTime()) return dateB - dateA;
      return a.produk.localeCompare(b.produk);
    });

    setLaporan(sorted);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'rekapHarian', id));
    setLaporan((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEditClick = (item) => {
    setEditData({
      ...item,
      tanggal: new Date(item.tanggal).toISOString().split('T')[0],
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    const docRef = doc(db, 'rekapHarian', editData.id);
    const jumlahTerjual = Number(editData.jumlahTerjual);
    const harga = Number(editData.harga);
    const total = jumlahTerjual * harga;

    await updateDoc(docRef, {
      produk: editData.produk,
      jumlahTerjual,
      harga,
      total,
      tanggal: Timestamp.fromDate(new Date(editData.tanggal)),
      emailPengguna: editData.emailPengguna || 'Tidak diketahui',
    });

    setEditData(null);
    fetchData();
  };

  const hasilFilter = laporan.filter((item) =>
    item.produk.toLowerCase().includes(cari.toLowerCase()) ||
    new Date(item.tanggal).toLocaleDateString('id-ID').includes(cari)
  );

  const groupedByDate = hasilFilter.reduce((acc, item) => {
    const tgl = new Date(item.tanggal).toLocaleDateString('id-ID');
    acc[tgl] = acc[tgl] || [];
    acc[tgl].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">📋 Laporan Harian Karyawan</h1>

        <input
          type="text"
          placeholder="🔍 Cari produk atau tanggal..."
          className="w-full md:w-1/2 mx-auto block mb-6 p-3 rounded bg-gray-800 text-white placeholder-gray-400"
          value={cari}
          onChange={(e) => setCari(e.target.value)}
        />

        {Object.keys(groupedByDate).length === 0 ? (
          <div className="text-center text-gray-400">Tidak ada data ditemukan.</div>
        ) : (
          Object.keys(groupedByDate).map((tanggal) => {
            const items = groupedByDate[tanggal];
            const totalPerTanggal = items.reduce((sum, item) => sum + (item.total || 0), 0);

            return (
              <div key={tanggal} className="mb-10">
                <h2 className="text-xl font-bold text-blue-400 border-b border-gray-600 pb-1 mb-3">
                  📅 {tanggal}
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left table-auto border border-gray-700">
                    <thead className="bg-gray-800 text-gray-300">
                      <tr>
                        <th className="px-4 py-3">Produk</th>
                        <th className="px-4 py-3">Jumlah Terjual</th>
                        <th className="px-4 py-3">Harga</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Email Pengguna</th>
                        <th className="px-4 py-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-900">
                          <td className="px-4 py-3">{item.produk}</td>
                          <td className="px-4 py-3">{item.jumlahTerjual}</td>
                          <td className="px-4 py-3">
                            Rp{isNaN(item.harga) ? '0' : item.harga.toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-3">
                            Rp{isNaN(item.total) ? '0' : item.total.toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-3">{item.emailPengguna}</td>
                          <td className="px-4 py-3 flex space-x-2">
                            <button
                              onClick={() => handleEditClick(item)}
                              className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-400"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-right text-green-400 font-semibold mt-2">
                  💵 Total Hari Ini: Rp{totalPerTanggal.toLocaleString('id-ID')}
                </div>
              </div>
            );
          })
        )}
      </div>

      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">✏️ Edit Laporan</h2>

            <div className="space-y-3">
              <label className="block">
                Produk:
                <input
                  name="produk"
                  value={editData.produk}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </label>

              <label className="block">
                Jumlah Terjual:
                <input
                  type="number"
                  name="jumlahTerjual"
                  value={editData.jumlahTerjual}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </label>

              <label className="block">
                Harga:
                <input
                  type="number"
                  name="harga"
                  value={editData.harga}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </label>

              <label className="block">
                Email Pengguna:
                <input
                  name="emailPengguna"
                  value={editData.emailPengguna || ''}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Email pengguna"
                />
              </label>

              <label className="block">
                Tanggal:
                <input
                  type="date"
                  name="tanggal"
                  value={editData.tanggal}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </label>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setEditData(null)}
                  className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
