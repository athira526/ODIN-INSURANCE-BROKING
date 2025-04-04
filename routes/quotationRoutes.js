const express = require("express");
const router = express.Router();
const prisma = require("../config/prismaClient"); // Ensure this is correct

// ✅ GET: Fetch all quotations
router.get("/", async (req, res) => {
  try {
    const quotations = await prisma.quotation.findMany();
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST: Create a new quotation
router.post("/", async (req, res) => {
  try {
    const { clientId, companyName, quoteDetails } = req.body;

    // Check if client exists before creating a quotation
    const existingClient = await prisma.client.findUnique({
      where: { id: clientId }
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

module.exports = router;
// Update a quotation (when company responds)
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
// Update a quotation (when company responds)
// Delete a quotation
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.quotation.delete({ where: { id } });

    res.status(204).send(); // No content response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
