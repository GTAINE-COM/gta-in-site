import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pg from "pg";
import "dotenv/config";

const app = express();
app.use(express.json());

// ВАЖНО: разрешаем запросы только с твоего сайта GitHub Pages
app.use(cors({
  origin: ["https://gtaine-com.github.io"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// --- helpers ---
function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function auth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Bad token" });
  }
}

// --- routes ---
app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });

  const { rows } = await pool.query("SELECT id, username, password_hash, balance FROM users WHERE username=$1", [username]);
  const user = rows[0];
  if (!user) return res.status(401).json({ error: "Wrong login" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Wrong login" });

  const token = signToken(user);
  res.json({ token });
});

app.get("/api/me", auth, async (req, res) => {
  const { rows } = await pool.query("SELECT id, username, balance FROM users WHERE id=$1", [req.user.id]);
  res.json(rows[0] || null);
});

app.get("/api/forbes", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT username, balance FROM users ORDER BY balance DESC LIMIT 50"
  );
  res.json(rows);
});

// JWT logout обычно просто удаление токена на клиенте
app.post("/api/logout", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("API running on", port));
