import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";
import { ArrowLeftIcon } from "@heroicons/react/solid"; // Menggunakan Heroicons

export default function ManajemenAkun() {
  const [dataKaryawan, setDataKaryawan] = useState([]);
  const [dataPelanggan, setDataPelanggan] = useState([]);
  const [newAkun, setNewAkun] = useState({
    nama: "",
    email: "",
    password: "",
    role: "karyawan", // Role default adalah 'karyawan'
  });
  const [editId, setEditId] = useState(null);
  const router = useRouter();

  // Ambil data dari koleksi 'users' di Firestore
  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    
    const usersData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Pisahkan data berdasarkan role
    const karyawanData = usersData.filter(user => user.role === 'karyawan' || user.role === 'kepala_toko');
    const pelangganData = usersData.filter(user => user.role === 'pelanggan');

    setDataKaryawan(karyawanData);
    setDataPelanggan(pelangganData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle input form
  const handleChange = (e) => {
    setNewAkun({ ...newAkun, [e.target.name]: e.target.value });
  };

  // Fungsi untuk menambah akun baru (Hanya dengan role karyawan atau kepala toko)
  const handleAdd = async () => {
    if (newAkun.role !== "karyawan" && newAkun.role !== "kepala_toko") {
      alert("Hanya bisa menambahkan role 'karyawan' atau 'kepala_toko'.");
      return;
    }

    // Tambah akun baru ke Firestore (users)
    try {
      await addDoc(collection(db, "users"), newAkun);
      setNewAkun({ nama: "", email: "", password: "", role: "karyawan" });
      fetchData();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Gagal menambahkan data.");
    }
  };

  // Edit data (ambil data untuk diupdate)
  const handleEdit = (akun) => {
    setNewAkun(akun);
    setEditId(akun.id);
  };

  // Update data di Firestore
  const handleUpdate = async () => {
    if (newAkun.role !== "karyawan" && newAkun.role !== "kepala_toko") {
      alert("Hanya bisa mengubah role ke karyawan atau kepala_toko.");
      return;
    }

    // Pastikan kita update data di koleksi 'users' berdasarkan id
    const docRef = doc(db, "users", editId);
    try {
      await updateDoc(docRef, {
        nama: newAkun.nama,
        email: newAkun.email,
        role: newAkun.role,
        password: newAkun.password, // Jika ingin mengupdate password
      });
      setEditId(null);
      setNewAkun({ nama: "", email: "", password: "", role: "karyawan" });
      fetchData();
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Gagal memperbarui data.");
    }
  };

  // Hapus data
  const handleDelete = async (id) => {
    const docRef = doc(db, "users", id);
    await deleteDoc(docRef);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 to-purple-900 text-white p-8 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Manajemen Akun</h1>
        <button
          onClick={() => router.push("/kepala")}
          className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition duration-300"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Kembali ke Dashboard
        </button>
      </div>

      {/* Form Tambah/Edit Akun */}
      <div className="bg-white rounded-xl p-6 mb-6 text-gray-800 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Akun" : "Tambah Akun Karyawan/Kepala Toko"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="nama"
            value={newAkun.nama}
            onChange={handleChange}
            placeholder="Nama"
            className="px-4 py-2 rounded bg-gray-100"
          />
          <input
            type="email"
            name="email"
            value={newAkun.email}
            onChange={handleChange}
            placeholder="Email"
            className="px-4 py-2 rounded bg-gray-100"
          />
          <input
            type="password"
            name="password"
            value={newAkun.password}
            onChange={handleChange}
            placeholder="Password"
            className="px-4 py-2 rounded bg-gray-100"
          />
          <select
            name="role"
            value={newAkun.role}
            onChange={handleChange}
            className="px-4 py-2 rounded bg-gray-100"
          >
            <option value="karyawan">Karyawan</option>
            <option value="kepala_toko">Kepala Toko</option>
          </select>
          <button
            onClick={editId ? handleUpdate : handleAdd}
            className={`${
              editId ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
            } text-white font-semibold py-2 rounded transition duration-300`}
          >
            {editId ? "Update" : "Tambah"}
          </button>
        </div>
      </div>

      {/* Tabel Karyawan */}
      <div className="overflow-x-auto mb-8">
        <h2 className="text-xl font-semibold mb-4">Daftar Karyawan dan Kepala Toko</h2>
        <table className="w-full table-auto bg-white text-gray-800 rounded-xl shadow-lg">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="py-2 px-4">Nama</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataKaryawan.map((karyawan) => (
              <tr key={karyawan.id} className="border-b border-gray-300">
                <td className="py-2 px-4">{karyawan.nama}</td>
                <td className="py-2 px-4">{karyawan.email}</td>
                <td className="py-2 px-4">{karyawan.role}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => handleEdit(karyawan)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(karyawan.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabel Pelanggan */}
      <div className="overflow-x-auto mb-8">
        <h2 className="text-xl font-semibold mb-4">Daftar Pelanggan</h2>
        <table className="w-full table-auto bg-white text-gray-800 rounded-xl shadow-lg">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="py-2 px-4">Nama</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Role</th>
            </tr>
          </thead>
          <tbody>
            {dataPelanggan.map((pelanggan) => (
              <tr key={pelanggan.id} className="border-b border-gray-300">
                <td className="py-2 px-4">{pelanggan.nama}</td>
                <td className="py-2 px-4">{pelanggan.email}</td>
                <td className="py-2 px-4">{pelanggan.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    <footer className="bg-black text-white py-5 text-center text-sm">
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