# AWE Electronics Store - Web Application

This project is a web application simulating a simple online electronics store. It allows users to browse products, manage a shopping cart, place orders, and generate sales reports.

## Prerequisites

*   Node.js (version 18.x or higher recommended, as per project setup using ES Modules)
*   npm (Node Package Manager, typically comes with Node.js)
*   A modern web browser

## Setup & Installation

1.  **Extract the Archive**: If you have a .zip or .rar, extract the project files to a local directory.
2.  **Navigate to Project Directory**: Open your terminal or command prompt and change to the project's root folder:
    ```bash
    cd path/to/awe-electronics-store
    ```
3.  **Install Dependencies**: Run the following command to install the necessary dependencies:
    ```bash
    npm install
    ```

## Running the Application

To start the application, simply open the `ui/index.html` file in your web browser.

## Features

*   **Product Catalogue**: View all available products, search by name, and filter by category.
*   **Shopping Cart**: Add products to a cart, view cart contents, update item quantities, and remove items.
*   **Order Management**: Checkout items from the cart, simulate payment processing (with a chance of failure and one retry), update product stock, and generate order confirmations including invoice and shipment details.
*   **Sales Reporting**: Generate aggregated sales reports from historical order data, including total revenue, order count, top-selling products, and daily sales breakdowns. Reports can be viewed in the web interface and optionally exported to a text file.

## Project Structure Overview

*   `src/`: Contains the core application logic.
    *   `controllers/`: Functional classes orchestrating business logic (e.g., `cartManager.js`, `orderManager.js`).
    *   `data/`: Stores JSON files for persistence (e.g., `products.json`, `orders.json`).
    *   `models/`: Data-holder classes (e.g., `product.js`, `orderItem.js`, `order.js`).
    *   `services/`: Business logic services (e.g., `catalogue.js`, `paymentProcessor.js`, `salesReport.js`).
    *   `utils/`: Utility functions (e.g., `idGenerator.js`).
    *   `main.js`: The main entry point for the application.
*   `ui/`: Contains the web interface files (HTML, CSS, JavaScript).
*   `reports/`: Default directory for exported sales reports (created if a report is exported).
*   `package.json`: Lists project dependencies and scripts.
*   `.eslintrc.json` / `eslint.config.js`: ESLint configuration.
*   `.prettierrc`: Prettier configuration.
*   `README.md`: This file.

## Data Persistence

*   **Product Data**: Loaded from `src/data/products.json`.
*   **Order Data**: Confirmed orders are saved to `src/data/orders.json`. This file is created/updated automatically.
*   **Sales Reports**: Exported reports (optional) are saved in the `reports/` directory.

## Notes

*   The application uses relative paths for file access, so it should run from the root `awe-electronics-store` directory.
*   Ensure `products.json` is present in `src/data/` for the catalogue to load. Sample data is provided.
*   `orders.json` will be created in `src/data/` when the first order is successfully placed. If you wish to test sales reports on a fresh setup, you might need to place a few orders first or manually create a sample `orders.json` (though the report generator handles its absence gracefully).
