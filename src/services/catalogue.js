import fs from 'fs';
import { Product } from '../models/product.js';

export class Catalogue {
  constructor() {
    this.products = [];
  }

  loadProducts() {
    const raw = fs.readFileSync('./src/data/products.json');
    const data = JSON.parse(raw);
    this.products = data.map(p => new Product(p));
  }

  listAll() {
    return this.products;
  }

  searchByKeyword(keyword) {
    return this.products.filter(p =>
      p.name.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  filterByCategory(category) {
    return this.products.filter(p =>
      p.category.toLowerCase() === category.toLowerCase()
    );
  }
} 