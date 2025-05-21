import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Register() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await setDoc(doc(db, 'users', user.uid), {
        nama: formData.nama,
        email: formData.email,
        role: 'pelanggan',
        createdAt: new Date(),
      });

      setShowSuccess(true); // Menampilkan popup sukses
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-cyan-400 to-white px-4">
      {/* Form Register */}
      {!showSuccess && (
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-white/30 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
            Daftar Sebagai Pelanggan
          </h2>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition shadow-md"
            >
              {loading ? 'Mendaftarkan...' : 'Daftar'}
            </button>
          </form>
          <p className="mt-4 text-sm text-center text-gray-700">
            Sudah punya akun?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Login di sini
            </a>
          </p>
        </div>
      )}

      {/* Popup Sukses */}
      {showSuccess && (
        <div className="absolute flex items-center justify-center inset-0">
          <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-lg w-full max-w-sm text-center">
            <h3 className="text-xl font-bold text-green-600 mb-2">Registrasi Berhasil!</h3>
            <p className="text-gray-700 mb-4">Silakan login untuk mulai menggunakan aplikasi.</p>
            <button
              onClick={handleCloseSuccess}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
            >
              Oke
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
