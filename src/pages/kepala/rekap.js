import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc
} from 'firebase/firestore';

export default function RekapStok() {
  const [produkList, setProdukList] = useState([]);
  const [rekapData, setRekapData] = useState([]);
  const [harianData, setHarianData] = useState([]);

  const now = new Date();
  const bulanIni = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const tanggalHariIni = now.toISOString().slice(0, 10); // YYYY-MM-DD

  // Ambil daftar produk
  useEffect(() => {
    const q = query(collection(db, 'produkHarga'), orderBy('nama'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProdukList(list);
    });
    return () => unsubscribe();
  }, []);

  // Ambil data rekap untuk bulan ini
  useEffect(() => {
    const q = query(collection(db, 'rekapStok'), where('bulan', '==', bulanIni));
    const unsubscribe = onSnapshot(q, snapshot => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRekapData(list);
    });
    return () => unsubscribe();
  }, [bulanIni]);

  // Ambil stok harian untuk hari ini
  useEffect(() => {
    const q = query(collection(db, 'stokHarian'), where('tanggal', '==', tanggalHariIni));
    const unsubscribe = onSnapshot(q, snapshot => {
      const harian = [];
      snapshot.forEach(doc => {
        harian.push(...doc.data().produkData);
      });
      setHarianData(harian);
    });
    return () => unsubscribe();
  }, [tanggalHariIni]);

  // Sinkronisasi stok harian ke rekapStok
  useEffect(() => {
    harianData.forEach(async (item) => {
      const match = rekapData.find(r => r.produkId === item.produkId);
      if (match) {
        const ref = doc(db, 'rekapStok', match.id);
        await updateDoc(ref, {
          stokAwalHariIni: item.jumlahStokAwal,
          stokAkhirHariIni: item.jumlahStokAkhir,
          tanggal: tanggalHariIni,
        });
      }
    });
  }, [harianData, rekapData]);

  // Tambah stok bulanan
  const handleSiapkanStok = async (produkId, nama) => {
    const existing = rekapData.find(r => r.produkId === produkId);
    if (existing) {
      const konfirmasi = confirm(`Stok untuk ${nama} sudah ada. Ingin memperbarui?`);
      if (!konfirmasi) return;
      const stokBaru = prompt(`Masukkan stok bulanan baru untuk ${nama}:`);
      if (!stokBaru || isNaN(stokBaru)) return;
      const ref = doc(db, 'rekapStok', existing.id);
      await updateDoc(ref, {
        stokBulanan: Number(stokBaru),
        tanggal: tanggalHariIni,
      });
    } else {
      const stok = prompt(`Masukkan stok bulanan untuk ${nama}:`);
      if (!stok || isNaN(stok)) return;
      await addDoc(collection(db, 'rekapStok'), {
        produkId,
        namaProduk: nama,
        bulan: bulanIni,
        stokBulanan: Number(stok),
        stokAwalHariIni: 0,
        stokAkhirHariIni: 0,
        tanggal: tanggalHariIni,
      });
    }
  };

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">Rekap Stok Bulanan</h1>
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th>Produk</th>
              <th>Stok Bulanan</th>
              <th>Stok Awal Hari Ini</th>
              <th>Stok Akhir Hari Ini</th>
              <th>Sisa</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {produkList.map(prod => {
              const rekap = rekapData.find(r => r.produkId === prod.id);
              const sisa = rekap
                ? rekap.stokBulanan - (rekap.stokAwalHariIni - rekap.stokAkhirHariIni)
                : '-';
              return (
                <tr key={prod.id} className="border-t">
                  <td>{prod.nama}</td>
                  <td className="text-center">{rekap?.stokBulanan ?? '-'}</td>
                  <td className="text-center">{rekap?.stokAwalHariIni ?? '-'}</td>
                  <td className="text-center">{rekap?.stokAkhirHariIni ?? '-'}</td>
                  <td className="text-center">{typeof sisa === 'number' ? sisa : '-'}</td>
                  <td className="text-center">
                    <button
                      onClick={() => handleSiapkanStok(prod.id, prod.nama)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      {rekap ? 'Ubah' : 'Siapkan'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
