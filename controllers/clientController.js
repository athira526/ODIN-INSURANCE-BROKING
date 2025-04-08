const { PrismaClient } = require('@prisma/client');
const admin = require('firebase-admin');

const prisma = new PrismaClient();

// Initialize Firebase Admin with service account
try {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
} catch (error) {
  console.error('Firebase initialization failed:', error.stack);
}

const bucket = admin.storage().bucket();

// Create a new client
exports.createClient = async (req, res) => {
  try {
    const { name, email, phone, policyType, renewal } = req.body;
    let supportingDoc = null;

    if (req.file) {
      console.log('Uploading file:', req.file.originalname);
      const fileName = `clients/${Date.now()}-${req.file.originalname}`;
      const file = bucket.file(fileName);

      await file.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype },
        public: true,
      });

      supportingDoc = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${fileName}`;
      console.log('File uploaded:', supportingDoc);
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        policyType,
        renewal: renewal === 'true',
        supportingDoc,
      },
    });

    res.status(201).json(client);
  } catch (error) {
    console.error('Detailed error in createClient:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

// Get all clients
exports.getClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany();
    res.status(200).json(clients);
  } catch (error) {
    console.error('Error in getClients:', error.stack);
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
    console.error('Error in getClientById:', error.stack);
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
    console.error('Error in updateClient:', error.stack);
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
    console.error('Error in deleteClient:', error.stack);
    res.status(500).json({ error: error.message });
  }
};