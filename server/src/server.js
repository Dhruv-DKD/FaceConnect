import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";
import path from "path";

const app = express();
const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow frontend to send cookies
  })
);
app.use(express.json());
app.use(cookieParser());

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDB } from "./libs/db.js";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "../client/dist");
  console.log("🧭 Static path:", staticPath);

  app.use(express.static(staticPath));

  // React Router fallback
  // ✅ Works in Express 5+
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

connectDB()
  .then(() => {
    app.listen(PORT || 5000, (req, res) => {
      console.log(`⚙️   Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB CONNECTION FAILED (server.js) !!", err);
  });
