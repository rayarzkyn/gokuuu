import { useRouter } from 'next/router';
import { auth } from '../../firebase/config';

export default function KaryawanDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/'); // arahkan ke halaman login setelah logout
    } catch (error) {
      console.error('Logout gagal:', error);
      alert('Gagal logout, coba lagi.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white p-8 relative">
        {/* Button logout di kanan atas */}
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition"
        >
          Logout
        </button>

        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Dashboard Karyawan</h1>
          <p className="text-center text-gray-300 mb-12">
            Selamat datang di sistem stok harian. Silakan pilih aktivitas harian Anda.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kartu Stok Harian */}
            <Card
              title="📦 Stok Harian"
              description="Input stok awal dan stok akhir harian"
              link="/karyawan/harian"
              color="bg-blue-600"
            />

            {/* Kartu Laporan Harian */}
            <Card
              title="📊 Lihat Laporan"
              description="Lihat laporan yang telah diinput"
              link="/karyawan/lihat-laporan"
              color="bg-yellow-600"
            />

            {/* Kartu Daftar Harga Produk */}
            <Card
              title="💰 Daftar Harga Produk"
              description="Lihat daftar harga produk lengkap"
              link="/karyawan/daftar-harga"
              color="bg-purple-600"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Raya Rizkyana. All rights reserved.</p>
        <p className="mt-2">
          Developed with{' '}
          <span className="text-red-500"></span> by{' '}
          <a
            href="https://github.com/rayarizkyana"  // Ganti dengan profil GitHub Anda
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

function Card({ title, description, link, color }) {
  return (
    <a href={link}>
      <div className={`rounded-2xl p-6 shadow-lg hover:scale-105 transform transition ${color}`}>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-gray-200 mt-2">{description}</p>
      </div>
    </a>
  );
}
