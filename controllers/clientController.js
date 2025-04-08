const { PrismaClient } = require('@prisma/client');
const admin = require('firebase-admin');

const prisma = new PrismaClient();

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(), // Uses Render env vars
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

// Create a new client
exports.createClient = async (req, res) => {
  try {
    const { name, email, phone, policyType, renewal } = req.body;
    let supportingDoc = null;

    if (req.file) {
      const fileName = `clients/${Date.now()}-${req.file.originalname}`;
      const file = bucket.file(fileName);

      // Upload file to Firebase Storage
      await file.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype },
        public: true, // Public for now
      });

      // Get public URL
      supportingDoc = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${fileName}`;
    }

    // Save to Prisma database
    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        policyType,
        renewal: renewal === 'true', // Convert string to boolean
        supportingDoc, // Save the URL
      },
    });

    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
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
    if (!client) return res.status(404).json({ error: 'Client not found' });
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