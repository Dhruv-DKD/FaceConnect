import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;

import authRoutes from "./routes/auth.route.js";

app.use("/api/auth", authRoutes);

app.listen(PORT || 5000, (req, res) => {
  console.log(`⚙️   Server is running on port ${PORT}`);
});
