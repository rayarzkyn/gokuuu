import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk mengontrol menu

  // Toggle menu hamburger
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700 tracking-wide">Goku <span className="text-gray-700">Komunika</span></h1>

          <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <li><Link href="/" className="hover:text-blue-600 transition">Beranda</Link></li>
            <li><Link href="#tentang" className="hover:text-blue-600 transition">Tentang</Link></li>
            <li>
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition shadow"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu (Vertikal di Sebelah Kanan) */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-16 right-0 w-48 bg-white shadow-md z-20">
          <ul className="flex flex-col space-y-4 py-4 px-6 text-gray-700 font-medium">
            <li><Link href="/" className="hover:text-blue-600 transition">Beranda</Link></li>
            <li><Link href="#tentang" className="hover:text-blue-600 transition">Tentang</Link></li>
            <li>
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition shadow"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Menu Button */}
      <div className="fixed right-6 top-4 md:hidden flex items-center z-50">
        <button onClick={toggleMenu} className="text-gray-700 focus:outline-none relative z-10">
          <svg
            className={`w-6 h-6 transition-all duration-300 ${isMenuOpen ? 'rotate-45' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Hero Section */}
      <header className="bg-gradient-to-br from-blue-700 to-blue-500 text-white py-24">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 drop-shadow-lg">
            Goku Komunika
          </h2>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-8">
            Solusi pintar untuk pencatatan stok harian toko Anda.
            Cepat, akurat, dan mudah digunakan.
          </p>
          <Link
            href="/login"
            className="inline-block bg-white text-blue-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow"
          >
            Mulai Sekarang
          </Link>
        </div>
      </header>

      {/* Tentang Goku Komunika */}
      <section id="tentang" className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Tentang Goku Komunika</h3>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Goku Komunika adalah platform manajemen stok harian untuk toko grosir dan retail. Dengan sistem otomatisasi modern, pencatatan stok awal dan akhir kini lebih praktis, serta laporan dapat diakses secara real-time.
          </p>
        </div>
      </section>

      {/* Tentang Website */}
      <section className="py-16 bg-gray-200">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Tentang Website</h3>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Website ini dikembangkan menggunakan teknologi <span className="font-semibold text-blue-600">Next.js</span> dan <span className="font-semibold text-blue-600">Firebase</span>, dirancang agar cepat, aman, dan mudah diakses. Fitur login berbasis peran (role-based access) memungkinkan manajemen data yang aman antara <span className="italic">karyawan</span> dan <span className="italic">kepala toko</span>. Desain modern dan responsif memastikan kenyamanan penggunaan di berbagai perangkat.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 mt-auto">
        <div className="container mx-auto px-6 text-center text-sm">
          &copy; {new Date().getFullYear()} Goku Komunika. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
