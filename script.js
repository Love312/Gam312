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
