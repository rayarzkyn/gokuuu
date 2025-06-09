'use client';

import { useEffect, useState } from 'react';
import { HandIcon } from '@heroicons/react/solid';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useRouter } from 'next/navigation';


export default function RekapStok() {
  const router = useRouter();
  const [laporan, setLaporan] = useState([]);
  const [allDates, setAllDates] = useState([]);
  const [visibleDates, setVisibleDates] = useState([]);
  const [produkList, setProdukList] = useState([]);
  const [stokBulanan, setStokBulanan] = useState({});
  const [startIndex, setStartIndex] = useState(0);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduk, setModalProduk] = useState(null);
  const [modalJumlah, setModalJumlah] = useState('');
  const [modalAction, setModalAction] = useState('tambah'); // 'tambah' or 'kurangi'

  const range = 7;

  // Ambil data rekap penjualan harian
  useEffect(() => {
    const q = query(collection(db, 'rekapHarian'), orderBy('tanggal', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          produk: d.produk,
          jumlahTerjual: d.jumlahTerjual || 0,
          harga: d.harga || 0,
          total: d.total || 0,
          tanggal: d.tanggal?.toDate ? d.tanggal.toDate() : new Date(d.tanggal),
          emailPengguna: d.emailPengguna || '',
        };
      });

      setLaporan(data);

      const datesSet = new Set(data.map(item => item.tanggal.toISOString().slice(0, 10)));
      const sortedDates = Array.from(datesSet).sort();
      setAllDates(sortedDates);
      setStartIndex(0);
    });

    return () => unsubscribe();
  }, []);

  // Ambil data stok bulanan
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'stokBulanan'), (snapshot) => {
      const stokData = {};
      snapshot.forEach(doc => {
        const d = doc.data();
        stokData[d.namaProduk] = d.stok || 0;
      });
      setStokBulanan(stokData);
    });
    return () => unsub();
  }, []);

  // Daftar produk unik
  useEffect(() => {
    const produkSet = new Set(laporan.map(item => item.produk));
    const produkArr = Array.from(produkSet).sort((a, b) => a.localeCompare(b));
    setProdukList(produkArr);
  }, [laporan]);

  // Update tanggal visible sesuai startIndex dan range
  useEffect(() => {
    setVisibleDates(allDates.slice(startIndex, startIndex + range));
  }, [allDates, startIndex]);

  // Format tanggal (ambil tanggal saja)
  const formatTanggal = (tglStr) => {
    try {
      const dt = new Date(tglStr);
      return dt.getDate();
    } catch {
      return tglStr;
    }
  };

  // Dapatkan jumlah terjual produk pada tanggal tertentu
  const getJumlahTerjual = (produk, tanggal) => {
    const item = laporan.find(
      (d) =>
        d.produk === produk &&
        d.tanggal.toISOString().slice(0, 10) === tanggal
    );
    return item ? item.jumlahTerjual : 0;
  };

  // Total terjual produk selama semua tanggal
  const getTotalTerjual = (produk) => {
    return laporan
      .filter(d => d.produk === produk)
      .reduce((sum, curr) => sum + (curr.jumlahTerjual || 0), 0);
  };

  // Hitung sisa stok = stok bulanan - total terjual
  const getSisaStok = (produk) => {
    const stokAwal = stokBulanan[produk] || 0;
    const terjual = getTotalTerjual(produk);
    return stokAwal - terjual;
  };

  // Buka modal update stok
  const openModal = (produk) => {
    setModalProduk(produk);
    setModalJumlah('');
    setModalAction('tambah');
    setModalOpen(true);
  };

  // Tutup modal
  const closeModal = () => {
    setModalOpen(false);
    setModalProduk(null);
    setModalJumlah('');
  };

  // Submit update stok dari modal
  const handleUpdateStok = async () => {
    const jumlah = parseInt(modalJumlah);
    if (!jumlah || jumlah <= 0) {
      alert('Masukkan jumlah stok valid (lebih dari 0)');
      return;
    }

    const currentStok = stokBulanan[modalProduk] || 0;
    let newStok = currentStok;

    if (modalAction === 'tambah') {
      newStok = currentStok + jumlah;
    } else if (modalAction === 'kurangi') {
      if (jumlah > currentStok) {
        alert('Jumlah pengurangan melebihi stok saat ini');
        return;
      }
      newStok = currentStok - jumlah;
    }

    try {
      await setDoc(doc(db, 'stokBulanan', modalProduk), {
        namaProduk: modalProduk,
        stok: newStok,
      });
      alert(`Stok ${modalProduk} berhasil diperbarui menjadi ${newStok}.`);
      closeModal();
    } catch (error) {
      console.error('Gagal update stok:', error);
      alert('Gagal update stok. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-700">Rekap Penjualan Harian & Stok Bulanan</h1>
<button
  onClick={() => router.back()}
  className="flex items-center bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
>
  ← Kembali
</button>


        </div>

        <div className="overflow-auto">
          <table className="min-w-full border text-sm bg-white rounded overflow-hidden">
            <thead className="bg-gradient-to-r from-purple-300 to-blue-300 text-gray-800">
              <tr>
                <th className="border px-4 py-2" rowSpan={2}>Produk</th>
                <th className="border px-4 py-2" rowSpan={2}>Stok Awal Bulan</th>
                <th
                  className="border px-4 py-2 text-center font-semibold"
                  colSpan={visibleDates.length}
                >
                  Tanggal Penjualan
                  <div className="flex items-center justify-center space-x-2 mt-1">
                    <button
                      disabled={startIndex <= 0}
                      onClick={() => setStartIndex(prev => Math.max(prev - range, 0))}
                      className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-40"
                      title="Geser kiri"
                    >
                      ←
                    </button>
                    <button
                      disabled={startIndex + range >= allDates.length}
                      onClick={() => setStartIndex(prev => Math.min(prev + range, allDates.length - range))}
                      className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-40"
                      title="Geser kanan"
                    >
                      →
                    </button>
                  </div>
                </th>
                <th className="border px-4 py-2" rowSpan={2}>Sisa Stok</th>
                <th className="border px-4 py-2" rowSpan={2}>Update Stok</th>
              </tr>
              <tr>
                {visibleDates.map(tgl => (
                  <th
                    key={tgl}
                    className="border px-4 py-2 text-center font-semibold"
                    title={new Date(tgl).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  >
                    {formatTanggal(tgl)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {produkList.length === 0 ? (
                <tr>
                  <td colSpan={visibleDates.length + 4} className="text-center py-4 text-gray-500">
                    Tidak ada data penjualan.
                  </td>
                </tr>
              ) : (
                produkList.map((produk, idx) => {
                  const sisaStok = getSisaStok(produk);
                  const isLowStock = sisaStok < 100;

                  return (
                    <tr
                      key={produk}
                      className={isLowStock ? 'bg-red-100 font-semibold' : (idx % 2 === 0 ? 'bg-gray-100' : 'bg-white')}
                      title={isLowStock ? 'Stok kurang dari 100' : ''}
                    >
                      <td className="border px-2 py-1 font-medium">{produk}</td>
                      <td className="border px-2 py-1 text-center">{stokBulanan[produk] ?? 0}</td>

                      {visibleDates.map(tgl => (
                        <td
                          key={tgl}
                          className="border px-2 py-1 text-center"
                        >
                          {getJumlahTerjual(produk, tgl)}
                        </td>
                      ))}

                      <td className="border px-2 py-1 text-center font-semibold">
                        {sisaStok}
                      </td>

                      <td className="border px-2 py-1 text-center">
                        <button
                          onClick={() => openModal(produk)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          title={`Update stok untuk ${produk}`}
                        >
                          Update Stok
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Update Stok */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-lg p-6 w-full max-w-md shadow-lg">
              <h2 className="text-xl font-bold mb-4">Update Stok Produk</h2>
              <p className="mb-4">Produk: <strong>{modalProduk}</strong></p>

              <div className="mb-4">
                <label className="mr-4">
                  <input
                    type="radio"
                    value="tambah"
                    checked={modalAction === 'tambah'}
                    onChange={() => setModalAction('tambah')}
                    className="mr-1"
                  />
                  Tambah Stok
                </label>
                <label>
                  <input
                    type="radio"
                    value="kurangi"
                    checked={modalAction === 'kurangi'}
                    onChange={() => setModalAction('kurangi')}
                    className="mr-1"
                  />
                  Kurangi Stok
                </label>
              </div>

              <label className="block mb-2">
                Jumlah Stok yang akan {modalAction === 'tambah' ? 'ditambahkan' : 'dikurangi'}:
                <input
                  type="number"
                  min="1"
                  value={modalJumlah}
                  onChange={e => setModalJumlah(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded"
                />
              </label>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdateStok}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500"
                >
                  Simpan
                </button>
                
              </div>
            </div>
          </div>
        )}
  
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6 flex-grow">
      {/* ...isi konten utama seperti table, dll... */}
    </div>
    </div>

    {/* Footer di bawah */}
    <footer className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white py-6 mt-8 w-full">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Raya Rikyana. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Developed with by{' '}
            <a
              href="https://github.com/your-profile"
              className="text-indigo-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Raya Rizkyana
            </a>
          </p>
        </div>
      </footer>
      </div>
    
  );
}
