import express from 'express';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PRODUCTS_FILE_PATH = join(__dirname, '../../src/data/products.json');

router.get('/', (req, res) => {
  try {
    if (!fs.existsSync(PRODUCTS_FILE_PATH)) {
      return res.status(404).json({ success: false, message: 'Products file not found.' });
    }
    const raw = fs.readFileSync(PRODUCTS_FILE_PATH);
    const products = JSON.parse(raw);
    res.json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load products.', error: error.message });
  }
});

export default router; 