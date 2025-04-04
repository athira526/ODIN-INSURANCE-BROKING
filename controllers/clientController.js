const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create a new client
exports.createClient = async (req, res) => {
  try {
    const { name, email, phone, policyType, renewal } = req.body;
    const client = await prisma.client.create({
      data: { name, email, phone, policyType, renewal },
    });
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all clients
exports.getClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single client by ID
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await prisma.client.findUnique({
      where: { id },
    });
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a client
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, policyType, renewal } = req.body;
    const updatedClient = await prisma.client.update({
      where: { id },
      data: { name, email, phone, policyType, renewal },
    });
    res.status(200).json(updatedClient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a client
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.client.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
