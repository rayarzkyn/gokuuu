import { useRouter } from 'next/router';
import Link from 'next/link';

export default function KepalaDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Dashboard Kepala Toko</h1>
        <p className="text-center text-gray-400 mb-12">
          Kontrol penuh atas data stok harian dan manajemen toko.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>

        <div className="text-center mt-12">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition shadow-md"
          >
            Logout
          </button>
        </div>
      </div>

      <footer className="bg-black text-white py-6 w-full fixed bottom-0 left-0">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Goku Komunika. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Developed with by{' '}
            <Link
              href="https://github.com/your-profile"
              className="text-blue-500 hover:underline"
            >
              Raya Rizkyana
            </Link>
          </p>
        </div>
      </footer>
    </main>
  );
}

function Card({ title, description, link, color }) {
  return (
    <a href={link}>
      <div
        className={`rounded-2xl p-6 shadow-xl hover:scale-105 transform transition ${color}`}
      >
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-gray-200 mt-2">{description}</p>
      </div>
    </a>
  );
}
