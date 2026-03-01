import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

// разрешаем запросы с твоего сайта
app.use(cors({
  origin: ["https://gtaine-com.github.io"],
  methods: ["GET", "POST"],
}));

// проверка что сервер жив
app.get("/health", (req, res) => {
  res.json({ ok: true, message: "GTAINE API working 🚀" });
});

// тест login
app.post("/api/login", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }

  res.json({
    message: "Login successful",
    user: {
      username,
      balance: 10000
    }
  });
});

// тест forbes
app.get("/api/forbes", (req, res) => {
  res.json([
    { username: "Player1", balance: 50000 },
    { username: "Player2", balance: 30000 },
    { username: "Player3", balance: 15000 }
  ]);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("GTAINE API running on port", port);
});
