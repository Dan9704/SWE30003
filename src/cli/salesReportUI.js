import inquirer from 'inquirer';
import { SalesReport } from '../services/salesReport.js';

export async function showSalesReportMenu() {
  console.log('\n--- Sales Reports ---');
  const salesReport = new SalesReport();

  if (salesReport.getOrderCount() === 0) {
    console.log('No sales data available to generate a report.\n');
    return;
  }

  salesReport.displayReport();

  const { exportReport } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'exportReport',
      message: 'Would you like to export this report to a file?',
      default: false
    }
  ]);

  if (exportReport) {
    const filePath = salesReport.exportToFile();
    if (filePath) {
      // Optionally, do something with the filePath, like opening it, but for now, just log.
    }
  }
  console.log('\n--- End of Sales Report --- Returning to Main Menu...\n');
} 