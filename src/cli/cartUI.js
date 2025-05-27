import inquirer from 'inquirer';

export async function showCartMenu(cart, catalogue) {
  console.log('\n--- 🛒 Shopping Cart --- ');
  while (true) {
    const { action } = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'Shopping Cart - Choose an action:',
      choices: [
        'View Cart',
        'Add Product',
        'Update Quantity',
        'Remove Item',
        'View Total',
        'Back to Main Menu'
      ]
    });

    if (action === 'Back to Main Menu') break;

    if (action === 'View Cart') {
      if (cart.isEmpty()) {
        console.log('\nYour cart is empty.\n');
      } else {
        console.log('\n--- Your Cart Items ---');
        cart.listItems().forEach(i => console.log(`- ${i.toString()}`));
        console.log('-----------------------');
      }
    }

    if (action === 'Add Product') {
      const products = catalogue.listAll();
      if (products.length === 0) {
        console.log('\nThere are no products available in the catalogue to add.\n');
        continue;
      }
      const { productId, quantity } = await inquirer.prompt([
        {
          type: 'list',
          name: 'productId',
          message: 'Choose a product:',
          choices: products.map(p => ({ name: p.name, value: p.id }))
        },
        {
          type: 'number',
          name: 'quantity',
          message: 'Enter quantity:',
          validate: q => (Number.isInteger(q) && q > 0) ? true : 'Quantity must be a whole number greater than 0.'
        }
      ]);
      const product = products.find(p => p.id === productId);
      if (!product) {
        console.log('\nSelected product not found. Please try again.\n');
        continue;
      }
      cart.addProduct(product, quantity);
      console.log(`\nAdded ${quantity} × ${product.name} to cart.\n`);
    }

    if (action === 'Update Quantity') {
      const items = cart.listItems();
      if (items.length === 0) {
        console.log('\nCart is empty.\n');
        continue;
      }

      const { productId, newQty } = await inquirer.prompt([
        {
          type: 'list',
          name: 'productId',
          message: 'Select item to update:',
          choices: items.map(i => ({ name: `${i.product.name} (x${i.quantity})`, value: i.product.id }))
        },
        {
          type: 'number',
          name: 'newQty',
          message: 'Enter new quantity (0 to remove):',
          validate: q => (Number.isInteger(q) && q >= 0) ? true : 'Quantity must be a whole number, 0 or more.'
        }
      ]);
      cart.updateQuantity(productId, newQty);
      console.log(newQty === 0 ? '\nItem removed from cart.\n' : '\nUpdated cart quantity.\n');
    }

    if (action === 'Remove Item') {
      const items = cart.listItems();
      if (items.length === 0) {
        console.log('\nCart is empty.\n');
        continue;
      }

      const { productId } = await inquirer.prompt({
        type: 'list',
        name: 'productId',
        message: 'Select item to remove:',
        choices: items.map(i => ({ name: i.toString(), value: i.product.id }))
      });
      cart.removeItem(productId);
      console.log('\nItem removed from cart.\n');
    }

    if (action === 'View Total') {
      console.log(`\nCart Total: $${cart.getTotal()}\n`);
    }
    console.log('\n---------------------------'); // End of action separator
  }
  console.log('Returning to Main Menu...\n');
} 