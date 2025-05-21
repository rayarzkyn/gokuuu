import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { auth, db } from "../firebase/config";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before attempting login

    try {
      // Authenticate user with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, "users", userCredential.user.uid); // Refer to the user document in Firestore
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const role = userSnap.data().role; // Get the role from the Firestore document

        // Check the role and redirect accordingly
        if (role === "karyawan") {
          router.push("/karyawan");
        } else if (role === "kepala_toko") {
          router.push("/kepala");
        } else if (role === "pelanggan") {
          router.push("/pelanggan/dashboard"); // Redirect to pelanggan dashboard if role is pelanggan
        } else {
          setError("Role tidak dikenali.");
        }
      } else {
        setError("Data user tidak ditemukan.");
      }
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("Email tidak terdaftar.");
      } else if (err.code === "auth/wrong-password") {
        setError("Password salah.");
      } else {
        setError("Terjadi kesalahan, coba lagi.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md border border-blue-300">
        <h1 className="text-3xl font-bold text-center text-white mb-6 tracking-wide">
          🔐 Login Goku Komunika
        </h1>

        {error && (
          <div className="bg-red-500 text-white text-sm p-4 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-white/70 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 rounded-lg bg-white/70 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <HiEyeOff className="text-gray-600" size={20} />
              ) : (
                <HiEye className="text-gray-600" size={20} />
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-100 mt-6 text-center">
          Raya Rizkyana. All rights reserved.
        </p>
      </div>
    </div>
  );
}
