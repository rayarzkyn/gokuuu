// pages/api/login.js
import bcrypt from "bcryptjs";
import cookie from "cookie";

// Hash untuk:
// admin123, karyawan123, pelanggan123
const users = [
  {
    email: "admin@example.com",
    passwordHash: "$2a$10$CqP9YtYmb1.qoC/63I4AvONwbIaZOfEcAmKLBtcX4uFrwQrgvTof2", // admin123
    role: "kepala_toko",
  },
  {
    email: "karyawan@example.com",
    passwordHash: "$2a$10$bcAOdz6GHeBAcZWvZK7AseFepNRZrPL5ZbZ3etSOPUkfJoPuFHzvW", // karyawan123
    role: "karyawan",
  },
  {
    email: "pelanggan@example.com",
    passwordHash: "$2a$10$PTo7kLbaEXDhswKL9W.2Ge8bYQ5OZ7ERaWvOa3VKZoDbAtyyYkYqO", // pelanggan123
    role: "pelanggan",
  },
];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;
  console.log("Login request received:", email);

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "Email tidak ditemukan." });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: "Password salah." });
  }

  res.setHeader("Set-Cookie", cookie.serialize("userRole", user.role, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  }));

  return res.status(200).json({ message: "Login berhasil", role: user.role });
}
