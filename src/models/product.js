export class Product {
  constructor({ id, name, price, stock, category }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.category = category;
  }

  toString() {
    return `${this.name} ($${this.price}) - ${this.stock} in stock [${this.category}]`;
  }
} 