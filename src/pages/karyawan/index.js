// src/pages/karyawan/index.js

export default function KaryawanDashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white p-8">
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
            description="Lihat laporan penjualan yang telah diinput"
            link="/karyawan/lihat-laporan"
            color="bg-yellow-600"
          />
          
          <Card
            title="📊 Laporan Harian"
            description="Input laporan penjualan harian"
            link="/karyawan/rekap-harian"
            color="bg-green-600"
          />
        </div>
      </div>
    </main>
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
