import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { db } from "../../firebase/config";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hargaProduk, setHargaProduk] = useState({});
  const router = useRouter();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false); // close mobile menu after click
    }
  };

  // Fungsi logout, arahkan ke halaman utama /
  const handleLogout = () => {
    // Jika ada logic logout (hapus token, clear session dsb), letakkan di sini
    router.push("/"); // redirect ke halaman index
  };

  useEffect(() => {
    const produkCollection = collection(db, "produkHarga");
    const q = query(produkCollection, orderBy("nama"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = {};
      snapshot.docs.forEach((doc) => {
        const produk = doc.data();
        data[produk.nama] = produk.harga;
      });
      setHargaProduk(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="font-sans text-white bg-gradient-to-b from-cyan-900 via-slate-900 to-gray-900 min-h-screen">
      {/* Navbar */}
      <nav className="bg-slate-900 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-cyan-400 tracking-wide">
            Goku <span className="text-white">Komunika</span>
          </h1>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 text-white font-medium items-center">
            <li>
              <Link href="#harga" className="hover:text-cyan-400 transition">
                Daftar Harga
              </Link>
            </li>
            <li>
              <Link href="#tentang" className="hover:text-cyan-400 transition">
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link href="#contact" className="hover:text-cyan-400 transition">
                Kontak
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-white hover:text-cyan-400 bg-red-500 transition font-semibold px-4 py-1 rounded-full border border-white inline-flex items-center justify-center cursor-pointer"
                type="button"
              >
                Log Out
              </button>
            </li>
          </ul>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none relative z-50"
            aria-label="Toggle menu"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden fixed top-16 right-4 bg-white border border-gray-300 rounded-md shadow-lg w-48 py-4 px-3 z-40">
            <ul className="space-y-4 text-gray-800 font-medium">
              <li>
                <Link
                  href="#harga"
                  onClick={() => scrollToSection("harga")}
                  className="hover:text-cyan-600 transition block"
                >
                  Daftar Harga
                </Link>
              </li>
              <li>
                <Link
                  href="#tentang"
                  onClick={() => scrollToSection("tentang")}
                  className="hover:text-cyan-600 transition block"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-cyan-600 transition block"
                >
                  Kontak
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="hover:text-red-600 transition font-semibold block"
                  type="button"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Landing Section */}
      <section
        id="home"
        className="bg-gradient-to-b from-cyan-600 via-blue-800 to-indigo-900 py-20 px-6 text-center text-white"
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
            Selamat Datang di{" "}
            <span className="text-cyan-300">Goku Komunika</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
            <span className="block mb-3">
              Goku Komunika adalah solusi lengkap untuk semua kebutuhan digital
              Anda — mulai dari kartu perdana, kuota internet, hingga voucher
              top up berbagai layanan populer.
            </span>
            <span className="block mb-3">
              Kami menghadirkan harga yang kompetitif, transaksi cepat dan mudah,
              serta pelayanan ramah yang selalu siap membantu.
            </span>
            <span className="block">
              Temukan pengalaman berbelanja yang nyaman dan terpercaya hanya di
              Goku Komunika – partner terbaik Anda dalam dunia konektivitas
              digital!
            </span>
          </p>
        </div>
      </section>

      {/* Harga Section */}
      <section
        id="harga"
        className="bg-gradient-to-b from-indigo-900 to-gray-950 text-white py-16 px-4"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          💰 Daftar Harga Produk
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full max-w-4xl mx-auto table-auto border border-gray-700 shadow-md rounded-md">
            <thead className="bg-cyan-700 text-white">
              <tr>
                <th className="p-3 text-left">Produk</th>
                <th className="p-3 text-right">Harga (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(hargaProduk).length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center py-4 text-gray-400">
                    Memuat data...
                  </td>
                </tr>
              )}
              {Object.entries(hargaProduk).map(([produk, harga], i) => (
                <tr
                  key={i}
                  className="even:bg-gray-800 odd:bg-gray-900 border-b border-gray-700"
                >
                  <td className="p-3">{produk}</td>
                  <td className="p-3 text-right">
                    {harga.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tentang Kami Section */}
      <section
        id="tentang"
        className="bg-gradient-to-b from-gray-950 to-black text-gray-200 py-16 px-4"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
          📌 Tentang Kami
        </h2>
        <div className="max-w-3xl mx-auto text-center leading-relaxed">
          <p>
            <strong className="text-cyan-400">Goku Komunika</strong> adalah
            toko penyedia kartu perdana dan voucher data internet terpercaya
            sejak 2020. Kami berkomitmen memberikan harga terbaik dan
            pelayanan yang cepat kepada pelanggan.
          </p>
          <p className="mt-4">
            Dengan jaringan luas dan tim profesional, kami siap melayani kebutuhan
            komunikasi Anda kapan saja. Kami juga melayani penjualan retail dan
            grosir, serta menjamin keaslian setiap produk.
          </p>
        </div>
      </section>

       {/* Kontak Section */}
      <section
        id="contact"
        className="bg-gradient-to-b from-black to-gray-900 text-white py-16 px-4"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
          📞 Kontak
        </h2>
        <div className="max-w-xl mx-auto text-center">
          <p className="mb-3">
            📱 WhatsApp:{" "}
            <a
              href="https://wa.me/6281234567890"
              className="underline text-cyan-400"
            >
              +62 812-3456-7890
            </a>
          </p>
          <p className="mb-3">📍 Alamat: Sindangpakuon, Kec. Cimanggung, Kabupaten Sumedang, Jawa Barat 45364</p>
          <p className="mb-3">📧 Email: goku.komunika@email.com</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} Goku Komunika. All rights reserved.
      </footer>
    </div>
  );
}
