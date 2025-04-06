const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const clientRoutes = require("./routes/clientRoutes");
const quotationRoutes = require("./routes/quotationRoutes"); // ✅ Import quotations API

dotenv.config();
const app = express();

// ✅ CORS FIX: Allow localhost + your deployed frontend (add real domain later)
const corsOptions = {
  origin: ["http://localhost:5173"], // Replace/add your deployed frontend later
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use("/api/clients", clientRoutes);
app.use("/api/quotations", quotationRoutes); // ✅ Register quotations API

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
