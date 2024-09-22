// Utility function to navigate between pages
function navigateTo(page) {
  window.location.href = page;
}

// Existing Modals for Income/Expense
document.getElementById('addIncomeBtn')?.addEventListener('click', function() {
  document.getElementById('transactionModal').classList.add('active');
  document.getElementById('modalTitle').textContent = 'Add Income';
  document.getElementById('transactionForm').dataset.type = 'income';
});

document.getElementById('addExpenseBtn')?.addEventListener('click', function() {
  document.getElementById('transactionModal').classList.add('active');
  document.getElementById('modalTitle').textContent = 'Add Expense';
  document.getElementById('transactionForm').dataset.type = 'expense';
});

// Close Income/Expense Modal
document.getElementById('closeModal')?.addEventListener('click', function() {
  document.getElementById('transactionModal').classList.remove('active');
});

// Starred Entries Handling (Example for future use)
function renderStarredEntries() {
  const starredEntries = document.getElementById('starredEntries');
  starredEntries.innerHTML = ''; // Clear existing starred entries

  transactions.forEach((transaction, index) => {
    const starredItem = document.createElement('div');
    starredItem.classList.add('starred-item');
    starredItem.innerHTML = `
      <span class="description">${transaction.details}</span>
      <span class="amount ${transaction.amount > 0 ? 'income' : 'expense'}">${transaction.amount > 0 ? '+' : ''} $${transaction.amount.toFixed(2)}</span>
      <button class="add-to-budget-btn">Add to Budget</button>
    `;

    starredEntries.appendChild(starredItem);
  });
}

// Logout Button
document.getElementById('logoutBtn')?.addEventListener('click', function() {
  alert("You have been logged out.");
  navigateTo("login.html");
});

// Delete Account Button
document.getElementById('deleteAccountBtn')?.addEventListener('click', function() {
  if (confirm("Are you sure you want to delete your account?")) {
    localStorage.clear(); // Clear all user data
    alert("Account deleted.");
    navigateTo("signup.html");
  }
});

// Back Button
document.querySelector('.back-btn')?.addEventListener('click', function() {
  navigateTo('main.html');
});

// Add Budget Modal Logic
document.getElementById('addBudgetBtn')?.addEventListener('click', function() {
  // Open the modal for adding a budget
  document.getElementById('budgetModal').classList.add('active');
});

// Close Add Budget Modal
document.getElementById('closeModal')?.addEventListener('click', function() {
  document.getElementById('budgetModal').classList.remove('active');
});

// Save the New Budget and Add it to the List
document.getElementById('saveBudgetBtn')?.addEventListener('click', function() {
  const budgetTitle = document.getElementById('budgetTitleInput').value;

  if (budgetTitle) {
    // Add new budget to the list
    const budgetPages = document.getElementById('budgetPages');
    const newBudget = document.createElement('div');
    newBudget.classList.add('budget-item');
    newBudget.innerHTML = `
      <span class="description">${budgetTitle}</span>
      <span class="amount">+ $0.00</span>
      <button class="more-btn">⋮</button>
    `;

    // Append the new budget to the budget list
    budgetPages.appendChild(newBudget);

    // Clear the input and close the modal
    document.getElementById('budgetTitleInput').value = '';
    document.getElementById('budgetModal').classList.remove('active');
  } else {
    alert('Please enter a budget title.');
  }
});

// Initialize page and load budgets, transactions, and starred entries
window.onload = function() {
  renderBalanceSheets();  // Render budget pages on the main page
  renderTransactions();   // Render transactions on custom budget template page
  renderStarredEntries();  // Render starred entries on the starred page
};