import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query } from 'firebase/firestore';
import { useRouter } from 'next/router';

export default function RekapHarianKepala() {
  const [laporan, setLaporan] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredLaporan, setFilteredLaporan] = useState([]);
  const [totalPendapatan, setTotalPendapatan] = useState({});
  const router = useRouter();

  // Fungsi untuk mengambil laporan dari Firestore
  const fetchLaporan = async () => {
    const q = query(collection(db, 'rekapHarian'));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    setLaporan(data);
  };

  // Fungsi untuk mengelompokkan laporan berdasarkan tanggal dan produk
  const groupLaporan = (laporanData) => {
    const filtered = laporanData.filter((item) => {
      const produkLower = item.produk.toLowerCase();
      const searchLower = search.toLowerCase();
      const tanggal = new Date(item.tanggal.seconds * 1000);
      const tanggalString = tanggal.toLocaleDateString();
      return produkLower.includes(searchLower) || tanggalString.includes(searchLower);
    });

    const groupedByDate = {};

    filtered.forEach((item) => {
      const tanggal = new Date(item.tanggal.seconds * 1000).toLocaleDateString();
      if (!groupedByDate[tanggal]) {
        groupedByDate[tanggal] = [];
      }
      groupedByDate[tanggal].push(item);
    });

    const sortedData = Object.keys(groupedByDate)
      .sort((a, b) => new Date(a) - new Date(b))
      .map((tanggal) => {
        groupedByDate[tanggal].sort((a, b) => a.produk.localeCompare(b.produk));
        return { tanggal, laporan: groupedByDate[tanggal] };
      });

    return sortedData;
  };

  // Fungsi untuk menghitung total pendapatan per tanggal
  const calculatePendapatan = (laporanData) => {
    const totalPerTanggal = {};
    laporanData.forEach((group) => {
      let total = 0;
      group.laporan.forEach((item) => {
        const harga = item.harga || 0;
        const jumlahTerjual = item.jumlahTerjual || 0;
        const totalItem = jumlahTerjual * harga;
        total += totalItem;
      });
      totalPerTanggal[group.tanggal] = total;
    });
    setTotalPendapatan(totalPerTanggal);
  };

  // Mengambil laporan saat komponen pertama kali dimuat
  useEffect(() => {
    fetchLaporan();
  }, []);

  // Mengelompokkan dan menghitung pendapatan setelah laporan atau pencarian diubah
  useEffect(() => {
    const groupedData = groupLaporan(laporan);
    setFilteredLaporan(groupedData);
    calculatePendapatan(groupedData);
  }, [laporan, search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl relative">
        <div className="absolute top--1 right-8">
          <button
            onClick={() => router.push('/kepala')}
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            ← Kembali ke Dashboard
          </button>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <input
            type="text"
            placeholder="Cari nama produk atau tanggal"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-md bg-gray-800 text-white w-full md:w-1/2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left text-sm text-gray-300 bg-gray-900 rounded-lg shadow-lg">
            <thead className="bg-gradient-to-r from-blue-700 to-purple-700 text-white">
              <tr>
                <th className="px-6 py-3 text-lg font-semibold">Tanggal</th>
                <th className="px-6 py-3 text-lg font-semibold">Nama Produk</th>
                <th className="px-6 py-3 text-lg font-semibold">Jumlah Terjual</th>
                <th className="px-6 py-3 text-lg font-semibold">Harga</th>
                <th className="px-6 py-3 text-lg font-semibold">Total</th>
                <th className="px-6 py-3 text-lg font-semibold">Diinput Oleh</th>
              </tr>
            </thead>
            <tbody>
              {filteredLaporan.length > 0 ? (
                filteredLaporan.map((group) => (
                  <React.Fragment key={group.tanggal}>
                    <tr className="bg-gray-800 text-gray-100">
                      <td colSpan="6" className="px-6 py-4 text-xl font-bold text-gray-300 bg-gradient-to-r from-blue-700 to-purple-700">
                        {group.tanggal}
                      </td>
                    </tr>
                    {group.laporan.map((item, idx) => {
                      const harga = item.harga || 0;
                      const jumlahTerjual = item.jumlahTerjual || 0;
                      const total = jumlahTerjual * harga;
                      return (
                        <tr key={item.id} className={`border-b border-gray-700 ${idx % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'}`}>
                          <td className="px-6 py-3">{new Date(item.tanggal.seconds * 1000).toLocaleDateString()}</td>
                          <td className="px-6 py-3">{item.produk}</td>
                          <td className="px-6 py-3">{jumlahTerjual}</td>
                          <td className="px-6 py-3">Rp {harga.toLocaleString()}</td>
                          <td className="px-6 py-3">Rp {total.toLocaleString()}</td>
                          <td className="px-6 py-3">{item.emailPengguna || 'Tidak diketahui'}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td colSpan="5" className="px-6 py-3 text-right text-xl font-semibold text-gray-100">
                        Total Pendapatan:
                      </td>
                      <td className="px-6 py-3 text-xl font-semibold text-gray-100">
                        Rp {totalPendapatan[group.tanggal]?.toLocaleString() || '0'}
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-3 text-center">Tidak ada laporan yang tersedia.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
