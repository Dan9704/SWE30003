import inquirer from 'inquirer';

export async function showCatalogueMenu(catalogue) {
  console.log('\n--- 🛍️ Product Catalogue --- ');
  while (true) {
    const { action } = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'Product Catalogue - Choose an action:',
      choices: [
        'View All Products',
        'Search by Name',
        'Filter by Category',
        'Back to Main Menu'
      ]
    });

    if (action === 'Back to Main Menu') break;

    if (action === 'View All Products') {
      console.log('\nAll Products:\n');
      catalogue.listAll().forEach(p => console.log(`- ${p.toString()}`));
    } else if (action === 'Search by Name') {
      const { keyword } = await inquirer.prompt({
        type: 'input',
        name: 'keyword',
        message: 'Enter keyword to search:',
        validate: input => input.trim() !== '' ? true : 'Search keyword cannot be empty.'
      });
      const results = catalogue.searchByKeyword(keyword.trim());
      console.log(results.length ? '\nResults:\n' : '\nNo matches found.\n');
      results.forEach(p => console.log(`- ${p.toString()}`));
    } else if (action === 'Filter by Category') {
      const { category } = await inquirer.prompt({
        type: 'input',
        name: 'category',
        message: 'Enter category to filter:',
        validate: input => input.trim() !== '' ? true : 'Category cannot be empty.'
      });
      const results = catalogue.filterByCategory(category.trim());
      console.log(results.length ? '\nFiltered Products:\n' : '\nNo matches found.\n');
      results.forEach(p => console.log(`- ${p.toString()}`));
    }

    console.log('\n---------------------------'); // End of action separator
  }
  console.log('Returning to Main Menu...\n'); // Moved from bootstrap to here for clarity
} 