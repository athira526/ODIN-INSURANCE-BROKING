const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const clientRoutes = require("./routes/clientRoutes");
const quotationRoutes = require("./routes/quotationRoutes"); // ✅ Import quotations API

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/clients", clientRoutes);
app.use("/api/quotations", quotationRoutes); // ✅ Register quotations API

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

