'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { ArrowLeftIcon } from '@heroicons/react/solid';

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

    // Menyortir berdasarkan tanggal terbaru
    const sortedData = Object.keys(groupedByDate)
      .sort((a, b) => new Date(b) - new Date(a))  // Urutkan dari yang terbaru
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-600 to-green-800 text-white p-8 flex flex-col">
      {/* Header dengan judul dan tombol Kembali */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-center md:text-5xl text-white">
          <span className="text-yellow-500">Rekap</span> Harian Penjualan
        </h1>

        <button
          onClick={() => router.push('/kepala')}
          className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition duration-300"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Kembali ke Dashboard
        </button>
      </div>

      {/* Pencarian */}
      <div className="mb-6 flex justify-between items-center">
        {/* Fitur Cari */}
        <input
          type="text"
          placeholder="Cari nama produk atau tanggal"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-md bg-gray-800 text-white w-full md:w-1/2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabel Laporan */}
      <div className="overflow-x-auto">
        {filteredLaporan.length > 0 ? (
          filteredLaporan.map((group, index) => (
            <div key={group.tanggal} className="mb-6">
              {/* Tabel */}
              <table className="min-w-full table-auto text-left text-sm text-gray-300 bg-gray-900 rounded-lg shadow-lg">
                <thead className="bg-gradient-to-r from-purple-700 to-cyan-800 text-white">
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
                  {group.laporan.map((item, idx) => {
                    const harga = item.harga || 0;
                    const jumlahTerjual = item.jumlahTerjual || 0;
                    const total = jumlahTerjual * harga;
                    return (
                      <tr key={item.id} className={`border-b border-gray-700 ${idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}`}>
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
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <div className="px-6 py-3 text-center">Tidak ada laporan yang tersedia.</div>
        )}
      </div>

      {/* Footer */}
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
