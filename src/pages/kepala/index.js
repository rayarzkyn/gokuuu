'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { BackspaceIcon, BadgeCheckIcon, BookmarkIcon, HandIcon, HomeIcon, UserIcon, UserRemoveIcon } from '@heroicons/react/solid';
import Link from 'next/link';

export default function KepalaDashboard() {
  const router = useRouter();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // State untuk mengontrol modal logout

  // Fungsi untuk membuka modal konfirmasi logout
  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  // Fungsi untuk menutup modal konfirmasi logout
  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  // Fungsi untuk melakukan logout dan kembali ke halaman utama
  const handleLogout = () => {
    router.push('/'); // Arahkan ke halaman utama (index.js)
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-gray-900 text-white p-8 flex flex-col">
      {/* Tombol Logout Kanan Atas */}
      <div className="absolute top-6 right-8 z-10">
        <button
          onClick={openLogoutModal}
          className="flex items-center bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Modal Konfirmasi Logout */}
{isLogoutModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
    <div className="bg-white rounded-2xl p-8 w-[90%] max-w-md shadow-2xl text-center animate-fadeInUp">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Yakin ingin logout?</h2>
      <p className="text-gray-600 mb-6">Anda akan keluar dari dashboard kepala toko.</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-full transition duration-200"
        >
          Ya, Logout
        </button>
        <button
          onClick={closeLogoutModal}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-6 py-2 rounded-full transition duration-200"
        >
          Batal
        </button>
      </div>
    </div>
  </div>
)}


      <div className="max-w-5xl mx-auto flex-grow">
        <h1 className="text-4xl font-bold mb-6 text-center">Dashboard Kepala Toko</h1>
        <p className="text-center text-gray-400 mb-12">
          Kontrol penuh atas data stok harian dan manajemen toko.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            title="📊 Rekap Bulanan"
            description="Lihat laporan Audit Bulanan"
            link="/kepala/rekap"
            color="bg-indigo-700"
          />
          <Card
            title="🧑 Manage Karyawan"
            description="Kelola akun dan akses karyawan"
            link="/kepala/akun"
            color="bg-pink-700"
          />
          <Card
            title="📅 Rekap Harian"
            description="Lihat laporan harian yang diinput oleh karyawan"
            link="/kepala/rekap-harian"
            color="bg-yellow-600"
          />
          <Card
            title="💰 Kelola Harga Produk"
            description="Tambah, ubah, atau hapus harga produk"
            link="/kepala/harga-produk"
            color="bg-green-700"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-5 w-full absolute bottom-0 left-0">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Raya Rikyana. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Developed with by{' '}
            <a
              href="https://github.com/your-profile"
              className="text-blue-500 hover:underline"
            >
              Raya Rizkyana
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}

function Card({ title, description, link, color }) {
  return (
    <Link
      href={link}
      className={`rounded-2xl p-6 shadow-xl hover:scale-105 transform transition ${color} block`}
    >
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-gray-200 mt-2">{description}</p>
    </Link>
  );
}
