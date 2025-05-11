import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { useRouter } from 'next/router';

const hargaProduk = {
  "Kartu Axis 10GB": 15000,
  "Kartu Smartfren 8GB": 20000,
  "Kartu Telkomsel 20GB": 22000,
  "Kartu Telkomsel 30GB": 30000,
  "Kartu Tri 5GB": 15000,
  "Kartu XL 5GB": 20000,
  "Voucher IM3 4GB": 12000,
  "Voucher IM3 7GB": 20000,
  "Voucher IM3 8GB": 25000,
  "Voucher IM3 12GB": 40000,
  "Voucher IM3 20GB": 60000,
  "Voucher Telkomsel 1.5GB": 9000,
  "Voucher Telkomsel 2.5GB": 12000,
  "Voucher Telkomsel 3.5GB": 15000,
  "Voucher Telkomsel 4.5GB": 20000,
  "Voucher Telkomsel 5.5GB": 25000,
  "Voucher Telkomsel 12GB": 55000,
};

export default function RekapHarian() {
  const router = useRouter();

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const [rekapData, setRekapData] = useState([]);
  const [form, setForm] = useState({
    id: null,
    tanggal: getCurrentMonth(),
    produk: '',
    stokMasuk: 0,
    stokKeluar: 0,
  });

  const fetchRekapData = async () => {
    const q = query(collection(db, 'rekapHarian'), orderBy('produk', 'asc'));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRekapData(data);
  };

  useEffect(() => {
    fetchRekapData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, tanggal, produk, stokMasuk, stokKeluar } = form;
    const saldoAkhir = stokMasuk - stokKeluar;

    if (id) {
      await updateDoc(doc(db, 'rekapHarian', id), {
        tanggal,
        produk,
        stokMasuk,
        stokKeluar,
        saldoAkhir,
      });
    } else {
      await addDoc(collection(db, 'rekapHarian'), {
        tanggal,
        produk,
        stokMasuk,
        stokKeluar,
        saldoAkhir,
      });
    }

    fetchRekapData();
    resetForm();
  };

  const handleEdit = (rekap) => {
    setForm({
      id: rekap.id,
      tanggal: rekap.tanggal,
      produk: rekap.produk,
      stokMasuk: rekap.stokMasuk,
      stokKeluar: rekap.stokKeluar,
    });
  };

  const resetForm = () => {
    setForm({
      id: null,
      tanggal: getCurrentMonth(),
      produk: '',
      stokMasuk: 0,
      stokKeluar: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        {/* Tombol Kembali */}
        <div className="mb-4">
          <button
            onClick={() => router.push('/kepala')}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            ← Kembali ke Dashboard
          </button>
        </div>
        <h1 className="text-4xl font-bold mb-6 text-center">Rekap Stok Bulanan</h1>

        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md text-gray-800 mb-6">
          <h2 className="text-xl font-bold mb-4 text-center">
            {form.id ? 'Edit Rekap' : 'Tambah Rekap'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
  type="month"
  className="border p-2 rounded"
  value={form.tanggal}
  onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
  required
/>
            <select
              className="border p-2 rounded"
              value={form.produk}
              onChange={(e) => setForm({ ...form, produk: e.target.value })}
              required
            >
              <option value="">-- Pilih Produk --</option>
              {Object.keys(hargaProduk).map((produk) => (
                <option key={produk} value={produk}>{produk}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Stok Masuk"
              className="border p-2 rounded"
              value={form.stokMasuk}
              onChange={(e) => setForm({ ...form, stokMasuk: Number(e.target.value) })}
              required
            />
            <input
              type="number"
              placeholder="Stok Keluar"
              className="border p-2 rounded"
              value={form.stokKeluar}
              onChange={(e) => setForm({ ...form, stokKeluar: Number(e.target.value) })}
              required
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white ${form.id ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {form.id ? 'Update' : 'Tambah'}
            </button>
          </div>
          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="mt-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Batal Edit
            </button>
          )}
        </form>

        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white text-gray-800 rounded-xl shadow-lg">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="py-2 px-4">Bulan</th>
                <th className="py-2 px-4">Produk</th>
                <th className="py-2 px-4">Stok Awal Bulan</th>
                <th className="py-2 px-4">Stok Akhir Bulan</th>
                <th className="py-2 px-4">Jumlah Terjual</th>
                <th className="py-2 px-4">Harga</th>
                <th className="py-2 px-4">Jumlah (Rp)</th>
                <th className="py-2 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rekapData.map((rekap) => {
                const harga = hargaProduk[rekap.produk] || 0;
                const jumlah = rekap.saldoAkhir * harga;
                return (
                  <tr key={rekap.id} className="border-b border-gray-300">
                   <td className="py-2 px-4 text-center">
  {new Date(rekap.tanggal).toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
</td>
                    <td className="py-2 px-4 text-left">{rekap.produk}</td>
                    <td className="py-2 px-4 text-center">{rekap.stokMasuk}</td>
                    <td className="py-2 px-4 text-center">{rekap.stokKeluar}</td>
                    <td className="py-2 px-4 text-center">{rekap.saldoAkhir}</td>
                    <td className="py-2 px-4 text-center">Rp {harga.toLocaleString()}</td>
                    <td className="py-2 px-4 text-center font-semibold">Rp {jumlah.toLocaleString()}</td>
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => handleEdit(rekap)}
                        className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rekapData.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    Tidak ada data
                  </td>
                </tr>
              )}
              {rekapData.length > 0 && (
  <tr className="bg-gray-100 font-bold">
    <td></td>
     <td colSpan="5" className="py-2 px-4 text-right">Total Jumlah</td>
    <td className="py-2 px-4 text-center">
      {rekapData.reduce((total, item) => {
        const hargaProduk = {
          "Kartu Axis 10GB": 15000,
          "Kartu Smartfren 8GB": 20000,
          "Kartu Telkomsel 20GB": 22000,
          "Kartu Telkomsel 30GB": 30000,
          "Kartu Tri 5GB": 15000,
          "Kartu XL 5GB": 20000,
          "Voucher IM3 4GB": 12000,
          "Voucher IM3 7GB": 20000,
          "Voucher IM3 8GB": 25000,
          "Voucher IM3 12GB": 40000,
          "Voucher IM3 20GB": 60000,
          "Voucher Telkomsel 1.5GB": 9000,
          "Voucher Telkomsel 2.5GB": 12000,
          "Voucher Telkomsel 3.5GB": 15000,
          "Voucher Telkomsel 4.5GB": 20000,
          "Voucher Telkomsel 5.5GB": 25000,
        }[item.produk] || 0;

        return total + item.saldoAkhir * hargaProduk;
      }, 0).toLocaleString('id-ID')}
    </td>
    <td></td>
  </tr>
)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
