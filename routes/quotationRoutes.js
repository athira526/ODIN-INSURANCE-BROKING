const express = require("express");
const router = express.Router();
const prisma = require("../config/prismaClient"); // ✅ Ensure correct import

// ✅ GET: Fetch all quotations with client info
router.get("/", async (req, res) => {
  try {
    const quotations = await prisma.quotation.findMany({
      include: { client: true }, // 🔥 include client data
    });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ POST: Create a new quotation
router.post("/", async (req, res) => {
  try {
    const { clientId, companyName, quoteDetails } = req.body;

    const existingClient = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!existingClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    const quotation = await prisma.quotation.create({
      data: {
        clientId,
        companyName,
        quoteDetails,
      },
    });

    res.status(201).json(quotation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ PUT: Update a quotation (e.g., when company responds)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { responseDate, quoteDetails } = req.body;

    const updatedQuotation = await prisma.quotation.update({
      where: { id },
      data: { responseDate, quoteDetails },
    });

    res.json(updatedQuotation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ DELETE: Remove a quotation
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.quotation.delete({
      where: { id },
    });

    res.status(204).send(); // No content response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
