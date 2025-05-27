import inquirer from 'inquirer';

export async function showOrderMenu(orderManager, cart, customer) {
  if (cart.isEmpty()) {
    console.log('\nYour cart is empty. Please add items to your cart before checking out.\n');
    return;
  }

  console.log('\n--- 💳 Checkout & Order Placement --- ');
  console.log('Cart Summary:');
  cart.listItems().forEach(item => console.log(`- ${item.toString()}`));
  console.log(`Total: $${cart.getTotal()}\n`);

  const { confirmCheckout } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmCheckout',
      message: 'Proceed to payment and place order?',
      default: true
    }
  ]);

  if (!confirmCheckout) {
    console.log('\nCheckout cancelled. Returning to main menu.\n');
    return;
  }

  console.log('\nProcessing your order...');
  const result = await orderManager.finalizeOrder(cart, customer);

  if (result.success) {
    console.log(`\n🎉 ${result.message}`);
    console.log(`Order ID: ${result.order.id}`);
    if (result.order.invoice) {
      console.log(`Invoice ID: ${result.order.invoice.invoiceId} (Generated: ${new Date(result.order.invoice.timestamp).toLocaleString()})`);
    }
    if (result.order.shipment) {
      console.log(`Shipment Tracking: ${result.order.shipment.trackingId} via ${result.order.shipment.courier}`);
      console.log(`Estimated Delivery: ${result.order.shipment.estimatedDelivery}`);
    }
    console.log('\n--- Full Order Details (as saved to orders.json) ---');
    console.log(JSON.stringify(result.order, null, 2));
    console.log('\nThank you for your purchase! Returning to Main Menu...\n');
  } else {
    console.error(`\n❌ Order Failed: ${result.message}`);
    if (result.order && result.order.status === 'payment_failed' && result.order.payment && result.order.payment.message.includes('Retrying')) {
      // This case is when the first attempt failed, and OrderManager tried again.
      // The message from OrderManager already includes "Payment failed after retry: ..."
    } else if (result.order && result.order.status === 'payment_failed') {
      // This implies the first attempt might have failed and no automatic retry was configured here in UI for a second manual try.
      // However, OrderManager already implements one automatic retry.
      // For this phase, we rely on OrderManager's retry. A manual UI retry prompt could be added if needed.
      console.error('The payment attempt was unsuccessful. Please check your payment details or try again later.');
    }
    console.log('\nYour cart has not been cleared. You can try checking out again or modify your cart. Returning to Main Menu...\n');
  }
} 