// pages/index.js
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700 tracking-wide">
            Goku <span className="text-gray-700">Komunika</span>
          </h1>
          <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <li><Link href="/" className="hover:text-blue-600 transition">Beranda</Link></li>
            <li><Link href="#tentang" className="hover:text-blue-600 transition">Tentang</Link></li>
            <li>
              <Link href="/register" className="bg-indigo-600 text-white px-4 py-1.5 rounded-full hover:bg-green-700 transition shadow">
                Daftar
              </Link>
            </li>
            <li>
              <Link href="/login" className="bg-cyan-700 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition shadow">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-16 right-0 w-48 bg-white shadow-md z-20">
          <ul className="flex flex-col space-y-4 py-4 px-6 text-gray-700 font-medium">
            <li><Link href="/" className="hover:text-blue-600 transition">Beranda</Link></li>
            <li><Link href="#tentang" className="hover:text-blue-600 transition">Tentang</Link></li>
            <li><Link href="/register" className="bg-indigo-600 text-white px-4 py-1.5 rounded-full hover:bg-green-700 transition shadow">Daftar</Link></li>
            <li><Link href="/login" className="bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition shadow">Login</Link></li>
          </ul>
        </div>
      )}

      {/* Menu Button */}
      <div className="fixed right-6 top-4 md:hidden flex items-center z-50">
        <button onClick={toggleMenu} className="text-gray-700 focus:outline-none relative z-10">
          <svg className={`w-6 h-6 transition-all duration-300 ${isMenuOpen ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Hero Section */}
      <header className="bg-gradient-to-b from-indigo-800 via-blue-700 to-blue-600 text-white py-24">
        <div className="container mx-auto text-center px-6">
          <div className="max-w-3xl mx-auto border border-white/20 bg-white/10 backdrop-blur rounded-xl p-6 shadow-md">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 drop-shadow-lg">
              Goku Komunika
            </h2>
            <p className="text-lg sm:text-xl leading-relaxed text-justify">
              Goku Komunika adalah toko grosir digital terpercaya yang menyediakan berbagai kebutuhan konektivitas Anda — dari kartu perdana, paket data internet, hingga layanan top-up untuk e-wallet dan game online.
              Kami mengutamakan kecepatan transaksi, harga bersaing, dan layanan pelanggan yang profesional untuk memastikan kenyamanan setiap mitra usaha dan konsumen setia.
              Dengan sistem digital yang modern dan efisien, Goku Komunika hadir sebagai solusi terbaik untuk Anda yang ingin berjualan atau memenuhi kebutuhan digital sehari-hari dengan mudah dan aman.
            </p>
            <Link
              href="/login"
              className="inline-block mt-6 bg-white text-blue-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </header>

      {/* Tentang Goku Komunika */}
      <section id="tentang" className="py-20 bg-gradient-to-b from-blue-600 via-cyan-500 to-sky-400 text-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold mb-6">Tentang Goku Komunika</h3>
          <div className="max-w-3xl mx-auto border border-white/30 bg-white/80 backdrop-blur rounded-xl p-6 shadow-lg text-left">
            <p className="text-lg leading-relaxed text-justify">
              Berdiri sebagai pusat grosir digital, Goku Komunika melayani berbagai macam produk seperti paket data semua operator, pulsa reguler, voucher game, dan layanan digital lainnya yang dibutuhkan masyarakat modern.
              Dengan teknologi berbasis web yang cepat dan mudah diakses, pengguna dapat mencatat penjualan, memantau stok, dan melihat laporan secara real-time.
              Goku Komunika hadir untuk mendukung UMKM dan pelaku usaha digital di seluruh Indonesia.
            </p>
          </div>
        </div>
      </section>

      {/* Tentang Website */}
      <section className="py-16 bg-gradient-to-b from-sky-400 via-sky-200 to-white text-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold mb-6">Tentang Website</h3>
          <div className="max-w-3xl mx-auto border border-gray-300 bg-white/80 backdrop-blur rounded-xl p-6 shadow-lg text-left">
            <p className="text-lg leading-relaxed text-justify">
              Website ini dikembangkan menggunakan teknologi <span className="font-semibold text-blue-600">Next.js</span> dan <span className="font-semibold text-blue-600">Firebase</span>,
              dirancang agar cepat, aman, dan mudah diakses. Fitur login berbasis peran (role-based access)
              memungkinkan manajemen data yang aman antara <span className="italic">karyawan</span> dan <span className="italic">kepala toko</span>.
              Desain modern dan responsif memastikan kenyamanan penggunaan di berbagai perangkat.
            </p>
          </div>
        </div>
      </section>

      {/* Tentang Saya */}
      <section id="about-me" className="py-16 bg-gradient-to-b from-white via-cyan-500 to-sky-400 text-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold mb-6">Tentang Saya</h3>
          <div className="max-w-3xl mx-auto border border-white/30 bg-white/80 backdrop-blur rounded-xl p-6 shadow-lg text-center">
            <img
              src="/fotoprofil.jpg"
              alt="Foto Profil"
              className="w-40 h-40 object-cover rounded-full mx-auto mb-6"
            />
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Nama: Raya Rizkyana</h4>
      <p className="text-lg leading-relaxed text-justify">
        Saya adalah seorang mahasiswa di Universitas Ma'soem Prodi Sistem Informasi semester 4. Selain itu, saya juga terlibat dalam berbagai proyek terkait pengembangan sistem informasi dan teknologi di dunia digital.
        Di waktu luang, saya senang mengeksplorasi hal baru dalam dunia pemrograman dan terus berusaha mengembangkan diri di bidang ini.
      </p>
          </div>
        </div>
      </section>

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
