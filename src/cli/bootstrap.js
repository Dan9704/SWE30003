// cli/bootstrap.js
import inquirer from 'inquirer';
import { Catalogue } from '../services/catalogue.js';
import { showCatalogueMenu } from './catalogueUI.js';
import { ShoppingCart } from '../controllers/cartManager.js';
import { showCartMenu } from './cartUI.js';
import { OrderManager } from '../controllers/orderManager.js';
import { showOrderMenu } from './orderUI.js';
import { SalesReport } from '../services/salesReport.js';
import { showSalesReportMenu } from './salesReportUI.js';

// Initialize services and managers
const catalogue = new Catalogue();
catalogue.loadProducts(); // Load products at startup

const cart = new ShoppingCart();
const orderManager = new OrderManager(catalogue);

// Simplified customer object for this phase
const mockCustomer = { email: "test@example.com", id: "cust123" };

export async function bootstrap() {
  console.log('\n====================================');
  console.log('   Welcome to AWE Electronics Store   ');
  console.log('====================================\n');
  while (true) {
    const { section } = await inquirer.prompt({
      type: 'list',
      name: 'section',
      message: 'Main Menu - What would you like to do?',
      choices: [
        'Browse Catalogue',
        'Manage Cart',
        'Checkout',
        'Generate Sales Report',
        'Exit'
      ]
    });

    if (section === 'Exit') {
      console.log('\nGoodbye! Thank you for visiting AWE Electronics Store.\n');
      // Persist any final data if necessary, e.g., product stock if it were saved from catalogue
      // For now, orders are saved by OrderManager, and catalogue changes are in-memory.
      break;
    }

    switch (section) {
      case 'Browse Catalogue':
        await showCatalogueMenu(catalogue);
        break;
      case 'Manage Cart':
        await showCartMenu(cart, catalogue);
        break;
      case 'Checkout':
        await showOrderMenu(orderManager, cart, mockCustomer);
        break;
      case 'Generate Sales Report':
        await showSalesReportMenu();
        break;
      default:
        console.log('\nInvalid selection. Please choose an option from the menu.\n');
    }
    console.log('\n------------------------------------\n'); // Separator for better readability
  }
} 