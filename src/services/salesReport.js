import fs from 'fs';

const ORDERS_FILE_PATH = './src/data/orders.json';
const REPORTS_DIR = './reports';

export class SalesReport {
  constructor() {
    this.orders = this.loadOrders();
  }

  loadOrders() {
    try {
      if (fs.existsSync(ORDERS_FILE_PATH)) {
        const raw = fs.readFileSync(ORDERS_FILE_PATH);
        // Filter for orders with a confirmed status and valid payment
        const allOrders = JSON.parse(raw);
        return allOrders.filter(order => order.status === 'confirmed' && order.payment && order.payment.success);
      } else {
        console.log('No orders file found. No sales data to report.');
      }
    } catch (error) {
      console.error(`Error loading or parsing orders from ${ORDERS_FILE_PATH}:`, error);
    }
    return [];
  }

  getTotalRevenue() {
    if (!this.orders.length) return 0;
    return this.orders.reduce((sum, order) => sum + parseFloat(order.total), 0).toFixed(2);
  }

  getOrderCount() {
    return this.orders.length;
  }

  getTopProducts(n = 5) {
    if (!this.orders.length) return [];
    const productCounts = {};
    this.orders.forEach(order => {
      order.items.forEach(item => {
        const productName = item.product && item.product.name ? item.product.name : `Product ID ${item.product_id || 'Unknown'}`;
        productCounts[productName] = (productCounts[productName] || 0) + item.quantity;
      });
    });

    return Object.entries(productCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, n)
      .map(([name, units]) => ({ name, units }));
  }

  getSalesByDay() {
    if (!this.orders.length) return {};
    const salesByDay = {};
    this.orders.forEach(order => {
      const date = order.payment && order.payment.timestamp ? new Date(order.payment.timestamp).toISOString().split('T')[0] : 'Unknown Date';
      salesByDay[date] = (salesByDay[date] || 0) + parseFloat(order.total);
    });
    // Format to two decimal places
    for (const date in salesByDay) {
        salesByDay[date] = parseFloat(salesByDay[date].toFixed(2));
    }
    return salesByDay;
  }

  generateReportText() {
    const reportDate = new Date().toISOString().split('T')[0];
    const totalRevenue = this.getTotalRevenue();
    const orderCount = this.getOrderCount();
    const topProducts = this.getTopProducts();
    const salesByDay = this.getSalesByDay();

    if (orderCount === 0) {
      return "No sales data available.";
    }

    let report = `===== AWE ELECTRONICS: SALES REPORT =====\n`;
    report += `Date Generated: ${reportDate}\n`;
    report += `Total Revenue: $${totalRevenue}\n`;
    report += `Total Orders: ${orderCount}\n\n`;

    report += `Top Selling Products:\n`;
    if (topProducts.length > 0) {
      topProducts.forEach((p, index) => {
        report += `${index + 1}. ${p.name} — ${p.units} units\n`;
      });
    } else {
      report += `No product sales data.\n`;
    }
    report += `\n`;

    report += `Revenue by Day:\n`;
    const sortedDays = Object.keys(salesByDay).sort();
    if (sortedDays.length > 0) {
      sortedDays.forEach(day => {
        report += `${day}: $${salesByDay[day].toFixed(2)}\n`;
      });
    } else {
      report += `No daily sales data.\n`;
    }
    report += `=========================================\n`;
    return report;
  }

  displayReport() {
    console.log('\n' + this.generateReportText());
  }

  exportToFile() {
    if (this.getOrderCount() === 0) {
      console.log("No data to export.");
      return null;
    }
    const reportText = this.generateReportText();
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filePath = `${REPORTS_DIR}/sales-report-${timestamp}.txt`;

    try {
      if (!fs.existsSync(REPORTS_DIR)){
        fs.mkdirSync(REPORTS_DIR, { recursive: true });
      }
      fs.writeFileSync(filePath, reportText);
      console.log(`\nReport successfully exported to ${filePath}`);
      return filePath;
    } catch (error) {
      console.error(`Error exporting report to ${filePath}:`, error);
      return null;
    }
  }
} 