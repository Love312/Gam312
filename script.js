// Utility function to navigate between pages
function navigateTo(page) {
  window.location.href = page;
}

// Developer Mode Button (No Sign-Up/Login Required)
document.getElementById('devModeBtn')?.addEventListener('click', function() {
  navigateTo("main.html");
});

// Traditional Login Logic
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Validate login (in a real app, this would check with a server)
  const storedUsername = window.localStorage.getItem('username');
  const storedPassword = window.localStorage.getItem('password');

  if (username === storedUsername && password === storedPassword) {
    navigateTo("main.html");
  } else {
    alert("Invalid username or password");
  }
});

// Sign-Up Logic
document.getElementById('signupForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Simulate storing user data (in a real app, this would be sent to a server)
  window.localStorage.setItem('email', email);
  window.localStorage.setItem('username', username);
  window.localStorage.setItem('password', password);

  // Redirect to main page after sign-up
  navigateTo("main.html");
});

// Get balance sheets from localStorage (or initialize empty)
let balanceSheets = JSON.parse(localStorage.getItem('balanceSheets')) || [];
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let totalBalance = 0;

// Render the balance sheets on the main page
function renderBalanceSheets() {
  const budgetPages = document.getElementById('budgetPages');
  budgetPages.innerHTML = ''; // Clear existing budget pages

  // Example budget sheets (You can replace these with dynamic ones)
  balanceSheets = [
    { title: 'PC', amount: 3.27 },
    { title: 'RBC', amount: 5.75 },
    { title: 'October 1', amount: 2.36 },
    // Add more sheets as needed
  ];

  balanceSheets.forEach((sheet, index) => {
    const button = document.createElement('div');
    button.classList.add('budget-item');
    button.innerHTML = `
      <span class="description">${sheet.title}</span>
      <span class="amount">+ $${sheet.amount.toFixed(2)}</span>
      <button class="more-btn">⋮</button>
    `;

    button.addEventListener('click', function() {
      navigateTo(`custom_budget_template.html?sheetIndex=${index}`);
    });

    budgetPages.appendChild(button);
  });
}

// Render the transactions and update balance in custom budget template
function renderTransactions() {
  const transactionList = document.querySelector('.transaction-list');
  transactionList.innerHTML = ''; // Clear existing transactions
  totalBalance = 0; // Reset total balance

  transactions.forEach((transaction, index) => {
    const newRow = document.createElement('div');
    newRow.classList.add('transaction-item');
    newRow.classList.add(transaction.amount > 0 ? 'income' : 'expense');
    newRow.innerHTML = `
      <span class="description">${transaction.details}</span>
      <span class="amount ${transaction.amount > 0 ? 'income' : 'expense'}">${transaction.amount > 0 ? '+' : ''} $${transaction.amount.toFixed(2)}</span>
      <span class="date">${transaction.date}</span>
      <button class="more-btn">⋮</button>
    `;
    transactionList.appendChild(newRow);

    // Update total balance
    totalBalance += transaction.amount;
  });

  document.getElementById('totalIncome').textContent = `$${getIncomeTotal().toFixed(2)}`;
  document.getElementById('totalExpenses').textContent = `$${getExpenseTotal().toFixed(2)}`;
  document.getElementById('totalBalance').textContent = `$${totalBalance.toFixed(2)}`;
}

// Calculate total income
function getIncomeTotal() {
  return transactions.reduce((total, transaction) => {
    return transaction.amount > 0 ? total + transaction.amount : total;
  }, 0);
}

// Calculate total expenses
function getExpenseTotal() {
  return transactions.reduce((total, transaction) => {
    return transaction.amount < 0 ? total + Math.abs(transaction.amount) : total;
  }, 0);
}

// Add Income or Expense
document.getElementById('submitTransaction')?.addEventListener('click', function() {
  const date = document.getElementById('transactionDate').value;
  const amount = parseFloat(document.getElementById('transactionAmount').value);
  const details = document.getElementById('transactionDetails').value;
  const type = document.getElementById('transactionForm').dataset.type;

  // Validate input
  if (date && !isNaN(amount) && details) {
    const newTransaction = {
      date,
      amount: type === 'income' ? Math.abs(amount) : -Math.abs(amount),
      details
    };

    transactions.push(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Re-render transactions and reset form
    renderTransactions();
    document.getElementById('transactionForm').reset();
    document.getElementById('transactionModal').classList.remove('active');
  } else {
    alert('Please fill out all fields.');
  }
});

// Open modal to add income or expense
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

// Close modal
document.getElementById('closeModal')?.addEventListener('click', function() {
  document.getElementById('transactionModal').classList.remove('active');
});

// Starred entries handling (Example for future use)
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

// Logout button functionality
document.getElementById('logoutBtn')?.addEventListener('click', function() {
  alert("You have been logged out.");
  navigateTo("login.html");
});

// Delete Account button functionality
document.getElementById('deleteAccountBtn')?.addEventListener('click', function() {
  if (confirm("Are you sure you want to delete your account?")) {
    localStorage.clear(); // Clear all user data
    alert("Account deleted.");
    navigateTo("signup.html");
  }
});

// Back button functionality for pages with back buttons
document.querySelector('.back-btn')?.addEventListener('click', function() {
  navigateTo('main.html');
});

// Initialize page and load transactions
window.onload = function() {
  renderBalanceSheets();  // Render budget pages on the main page
  renderTransactions();   // Render transactions on custom budget template page
  renderStarredEntries();  // Render starred entries on the starred page
};

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

let touchstartX = 0;
let touchendX = 0;

function handleSwipe(budgetItem, index) {
  // Detect if swipe is left
  if (touchendX < touchstartX) {
    // Remove the budget item from the list
    budgetItem.remove();
    balanceSheets.splice(index, 1); // Remove from array
    localStorage.setItem('balanceSheets', JSON.stringify(balanceSheets)); // Update local storage
  }
}

// Add swipe event listeners to each budget item
function addSwipeListeners(budgetItem, index) {
  budgetItem.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
  }, false);

  budgetItem.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    handleSwipe(budgetItem, index); // Call swipe handler
  }, false);
}

// Render the balance sheets on the main page
function renderBalanceSheets() {
  const budgetPages = document.getElementById('budgetPages');
  budgetPages.innerHTML = ''; // Clear existing budget pages

  balanceSheets.forEach((sheet, index) => {
    const button = document.createElement('div');
    button.classList.add('budget-item');
    button.innerHTML = `
      <span class="description">${sheet.title}</span>
      <span class="amount">+ $${sheet.amount.toFixed(2)}</span>
      <button class="more-btn">⋮</button>
    `;

    // Append the new budget item
    budgetPages.appendChild(button);

    // Add swipe listeners
    addSwipeListeners(button, index);
  });
}
