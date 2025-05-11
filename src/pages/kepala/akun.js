import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useRouter } from "next/router";

export default function ManajemenKaryawan() {
  const [karyawanData, setKaryawanData] = useState([]);
  const [newKaryawan, setNewKaryawan] = useState({
    nama: "",
    email: "",
    role: "karyawan",
    status: "aktif",
  });
  const [editId, setEditId] = useState(null);
  const router = useRouter();

  // Ambil data dari Firestore
  const fetchKaryawanData = async () => {
    const querySnapshot = await getDocs(collection(db, "karyawan"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setKaryawanData(data);
  };

  useEffect(() => {
    fetchKaryawanData();
  }, []);

  // Handle input form
  const handleChange = (e) => {
    setNewKaryawan({ ...newKaryawan, [e.target.name]: e.target.value });
  };

  // Tambah data
  const handleAdd = async () => {
    if (newKaryawan.role !== "karyawan") {
      alert("Hanya bisa menambahkan role karyawan.");
      return;
    }

    await addDoc(collection(db, "karyawan"), newKaryawan);
    setNewKaryawan({ nama: "", email: "", role: "karyawan", status: "aktif" });
    fetchKaryawanData();
  };

  // Edit data
  const handleEdit = (karyawan) => {
    setNewKaryawan(karyawan);
    setEditId(karyawan.id);
  };

  // Update data
  const handleUpdate = async () => {
    if (newKaryawan.role !== "karyawan") {
      alert("Hanya bisa mengubah role ke karyawan.");
      return;
    }

    const docRef = doc(db, "karyawan", editId);
    await updateDoc(docRef, newKaryawan);
    setEditId(null);
    setNewKaryawan({ nama: "", email: "", role: "karyawan", status: "aktif" });
    fetchKaryawanData();
  };

  // Hapus data
  const handleDelete = async (id) => {
    const docRef = doc(db, "karyawan", id);
    await deleteDoc(docRef);
    fetchKaryawanData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 to-purple-900 text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Manajemen Karyawan</h1>
        <button
          onClick={() => router.push("/kepala")}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
        >
          ⬅️ Kembali ke Dashboard
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6 text-gray-800 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Karyawan" : "Tambah Karyawan"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="nama"
            value={newKaryawan.nama}
            onChange={handleChange}
            placeholder="Nama"
            className="px-4 py-2 rounded bg-gray-100"
          />
          <input
            type="email"
            name="email"
            value={newKaryawan.email}
            onChange={handleChange}
            placeholder="Email"
            className="px-4 py-2 rounded bg-gray-100"
          />
          <select
            name="status"
            value={newKaryawan.status}
            onChange={handleChange}
            className="px-4 py-2 rounded bg-gray-100"
          >
            <option value="aktif">Aktif</option>
            <option value="non-aktif">Non-Aktif</option>
          </select>
          <button
            onClick={editId ? handleUpdate : handleAdd}
            className={`${
              editId ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
            } text-white font-semibold py-2 rounded`}
          >
            {editId ? "Update" : "Tambah"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white text-gray-800 rounded-xl shadow-lg">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="py-2 px-4">Nama</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {karyawanData
              .filter((karyawan) => karyawan.role === "karyawan")
              .map((karyawan) => (
                <tr key={karyawan.id} className="border-b border-gray-300">
                  <td className="py-2 px-4">{karyawan.nama}</td>
                  <td className="py-2 px-4">{karyawan.email}</td>
                  <td className="py-2 px-4">
                    {karyawan.status === "aktif" ? (
                      <span className="text-green-600 font-medium">Aktif</span>
                    ) : (
                      <span className="text-red-600 font-medium">Non-Aktif</span>
                    )}
                  </td>
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
    </div>
  );
}
