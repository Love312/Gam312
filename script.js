// Utility function to navigate between pages
function navigateTo(page) {
  window.location.href = page;
}

// Developer Mode Button
document.getElementById('devModeBtn')?.addEventListener('click', function () {
  console.log("Developer Mode button clicked.");
  navigateTo('main.html');
});

// Add event listener for the login form submission
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const storedUsername = window.localStorage.getItem('username');
  const storedPassword = window.localStorage.getItem('password');

  if (username === storedUsername && password === storedPassword) {
    navigateTo("main.html");
  } else {
    alert("Invalid username or password");
  }
});

// Initialize balance sheets and transactions
let balanceSheets = JSON.parse(localStorage.getItem('balanceSheets')) || [];
let transactions = JSON.parse(localStorage.getItem('transactions')) || {};
let spendingLimits = JSON.parse(localStorage.getItem('spendingLimits')) || { weekly: 0, monthly: 0, yearly: 0 };

// Render the balance sheets with the options button appearing first
function renderBalanceSheets() {
  const budgetPages = document.getElementById('budgetPages');
  if (!budgetPages) return;

  budgetPages.innerHTML = ''; // Clear existing budgets

  balanceSheets.forEach((sheet, index) => {
    const budgetTitle = sheet.title;
    const transactionsList = transactions[budgetTitle] || [];
    let totalIncome = 0;
    let totalExpenses = 0;

    // Calculate the current balance for each budget
    transactionsList.forEach((transaction) => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += transaction.amount;
      }
    });

    const updatedBalance = totalIncome - totalExpenses;
    sheet.amount = updatedBalance; // Ensure the balance is stored

    const budgetItem = document.createElement('div');
    budgetItem.classList.add('budget-item');
    budgetItem.innerHTML = `
      <div class="more-options">
        <button class="more-btn">⋮</button>
        <div class="dropdown-content">
          <button class="rename-btn" data-index="${index}">Rename</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
          <button class="duplicate-btn" data-index="${index}">Duplicate</button>
        </div>
      </div>
      <span class="description">${sheet.title}</span>
     <span class="amount">${updatedBalance >= 0 ? '+' : '-'} ${getCurrencySymbol()}${Math.abs(updatedBalance).toFixed(2)}</span>
`;
    budgetPages.appendChild(budgetItem);

    // Make the budget item clickable to open the custom budget sheet
    budgetItem.addEventListener('click', function () {
      navigateTo(`custom_budget_template.html?budgetIndex=${index}`);
    });

    // Add event listeners for the buttons
    const moreBtn = budgetItem.querySelector('.more-btn');
    const renameBtn = budgetItem.querySelector('.rename-btn');
    const deleteBtn = budgetItem.querySelector('.delete-btn');
    const duplicateBtn = budgetItem.querySelector('.duplicate-btn');

    // Toggle options dropdown
    moreBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const options = budgetItem.querySelector('.dropdown-content');
      options.style.display = options.style.display === 'block' ? 'none' : 'block';
    });

    // Rename function
    renameBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      openRenameModal(index);
    });

    // Delete function
    deleteBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      balanceSheets.splice(index, 1);
      localStorage.setItem('balanceSheets', JSON.stringify(balanceSheets));
      renderBalanceSheets();
    });

    // Duplicate function
    duplicateBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const newBudget = { ...balanceSheets[index], title: `${balanceSheets[index].title} Copy` };
      balanceSheets.push(newBudget);
      localStorage.setItem('balanceSheets', JSON.stringify(balanceSheets));
      renderBalanceSheets();
    });
  });

  // Save updated balance sheets to localStorage
  localStorage.setItem('balanceSheets', JSON.stringify(balanceSheets));
}

// Open Rename Modal and handle renaming
function openRenameModal(index) {
  const renameModal = document.getElementById('renameModal');
  const renameInput = document.getElementById('renameBudgetInput');
  if (!renameModal || !renameInput) return;

  renameModal.classList.add('active');
  renameInput.value = balanceSheets[index].title;

  document.getElementById('saveRenameBtn').onclick = function () {
    const newTitle = renameInput.value;
    if (newTitle) {
      balanceSheets[index].title = newTitle;
      localStorage.setItem('balanceSheets', JSON.stringify(balanceSheets));
      renderBalanceSheets();
      renameModal.classList.remove('active');
    } else {
      alert('Please enter a valid title.');
    }
  };

  document.getElementById('closeRenameModal').onclick = function () {
    renameModal.classList.remove('active');
  };
}

// Add Budget Modal Logic
document.getElementById('addBudgetBtn')?.addEventListener('click', function () {
  document.getElementById('budgetModal').classList.add('active');
});

document.getElementById('closeModal')?.addEventListener('click', function () {
  document.getElementById('budgetModal').classList.remove('active');
});

document.getElementById('saveBudgetBtn')?.addEventListener('click', function () {
  const budgetTitle = document.getElementById('budgetTitleInput').value;

  if (budgetTitle) {
    const newBudget = {
      title: budgetTitle,
      amount: 0
    };

    balanceSheets.push(newBudget);
    localStorage.setItem('balanceSheets', JSON.stringify(balanceSheets));
    renderBalanceSheets();

    document.getElementById('budgetTitleInput').value = '';
    document.getElementById('budgetModal').classList.remove('active');
  } else {
    alert('Please enter a budget title.');
  }
});

// Render Transactions for the selected budget
function renderTransactions(budgetTitle) {
  const transactionsList = transactions[budgetTitle] || [];
  const transactionsContainer = document.getElementById('transactions');
  transactionsContainer.innerHTML = '';

  transactionsList.forEach((transaction, index) => {
    const transactionItem = document.createElement('div');
    transactionItem.classList.add('transaction-item');
    transactionItem.innerHTML = `
      <div class="transaction-options">
        <button class="more-btn">⋮</button>
        <div class="transaction-dropdown-content">
          <button class="edit-transaction-btn" data-index="${index}">Edit</button>
          <button class="delete-transaction-btn" data-index="${index}">Delete</button>
          <button class="duplicate-transaction-btn" data-index="${index}">Duplicate</button>
        </div>
      </div>

      <div class="transaction-details">
        <p>${transaction.details}</p>
        <p>${transaction.date}</p>
      

      <p class="transaction-amount ${transaction.type}">
      ${transaction.type === 'income' ? '+' : '-'} ${getCurrencySymbol()}${transaction.amount.toFixed(2)}</p>
`;
    transactionsContainer.appendChild(transactionItem);

    const moreBtn = transactionItem.querySelector('.more-btn');
    const transactionOptions = transactionItem.querySelector('.transaction-options');

    moreBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      transactionOptions.classList.toggle('active');
    });

    const editBtn = transactionItem.querySelector('.edit-transaction-btn');
    editBtn.addEventListener('click', function () {
      openEditTransactionModal(index, budgetTitle);
    });

    const deleteBtn = transactionItem.querySelector('.delete-transaction-btn');
    deleteBtn.addEventListener('click', function () {
      deleteTransaction(index, budgetTitle);
    });

    const duplicateBtn = transactionItem.querySelector('.duplicate-transaction-btn');
    duplicateBtn.addEventListener('click', function () {
      duplicateTransaction(index, budgetTitle);
    });
  });

  calculateSummary();
  updateProgressBars();
}

// Edit transaction modal logic
function openEditTransactionModal(index, budgetTitle) {
  const transaction = transactions[budgetTitle][index];
  if (!transaction) {
    console.error('Transaction not found');
    return;
  }

  document.getElementById('transactionAmount').value = transaction.amount;
  document.getElementById('transactionDate').value = transaction.date;
  document.getElementById('transactionDetails').value = transaction.details;

  document.getElementById('saveTransactionBtn').onclick = function () {
    const newAmount = parseFloat(document.getElementById('transactionAmount').value);
    const newDate = document.getElementById('transactionDate').value;
    const newDetails = document.getElementById('transactionDetails').value;

    if (newAmount && newDate && newDetails) {
      transactions[budgetTitle][index] = {
        amount: newAmount,
        date: newDate,
        details: newDetails,
        type: transaction.type
      };
      localStorage.setItem('transactions', JSON.stringify(transactions));
      renderTransactions(budgetTitle);
      calculateSummary();
      updateProgressBars();
      document.getElementById('transactionModal').classList.remove('active');
    } else {
      alert('Please fill out all fields.');
    }
  };

  document.getElementById('transactionModal').classList.add('active');
}

// Delete transaction
function deleteTransaction(index, budgetTitle) {
  transactions[budgetTitle].splice(index, 1); // Remove the transaction
  localStorage.setItem('transactions', JSON.stringify(transactions)); // Update localStorage
  renderTransactions(budgetTitle); // Re-render the transactions list
  calculateSummary(); // Update the summary after deletion
  updateProgressBars(); // Recalculate progress bars
}

// Duplicate transaction
function duplicateTransaction(index, budgetTitle) {
  const transaction = transactions[budgetTitle][index];
  if (transaction) {
    const newTransaction = { ...transaction }; // Duplicate the transaction
    transactions[budgetTitle].push(newTransaction); // Add the duplicated transaction
    localStorage.setItem('transactions', JSON.stringify(transactions)); // Update localStorage
    renderTransactions(budgetTitle); // Re-render the transactions list
    calculateSummary(); // Update the summary after duplication
    updateProgressBars(); // Recalculate progress bars
  }
}

// Close transaction modal
document.getElementById('closeModal').addEventListener('click', function () {
  document.getElementById('transactionModal').classList.remove('active');
});

// Function to calculate the summary (income, expenses, and balance)
function calculateSummary() {
  const budgetTitle = balanceSheets?.title;
  const transactionsList = transactions[budgetTitle] || [];
  let totalIncome = 0;
  let totalExpenses = 0;

  transactionsList.forEach((transaction) => {
    if (transaction.type === 'income') {
      totalIncome += transaction.amount;
    } else {
      totalExpenses += transaction.amount;
    }
  });

  const totalBalance = totalIncome - totalExpenses;
document.getElementById('totalIncome').textContent = `+ ${getCurrencySymbol()}${totalIncome.toFixed(2)}`;
document.getElementById('totalExpenses').textContent = `- ${getCurrencySymbol()}${totalExpenses.toFixed(2)}`;
document.getElementById('totalBalance').textContent = `${totalBalance >= 0 ? '+' : '-'} ${getCurrencySymbol()}${Math.abs(totalBalance).toFixed(2)}`;

  
  
}

// Function to update progress bars (weekly, monthly, yearly spending limits)
function updateProgressBars() {
  const budgetTitle = balanceSheets?.title;
  const transactionsList = transactions[budgetTitle] || [];
  let totalExpenses = 0;

  transactionsList.forEach((transaction) => {
    if (transaction.type === 'expense') {
      totalExpenses += transaction.amount;
    }
  });

  const weeklyLimit = spendingLimits.weekly || 0;
  const monthlyLimit = spendingLimits.monthly || 0;
  const yearlyLimit = spendingLimits.yearly || 0;

  const weeklyProgress = weeklyLimit > 0 ? (totalExpenses / weeklyLimit) * 100 : 0;
  const monthlyProgress = monthlyLimit > 0 ? (totalExpenses / monthlyLimit) * 100 : 0;
  const yearlyProgress = yearlyLimit > 0 ? (totalExpenses / yearlyLimit) * 100 : 0;

  // Update weekly progress bar
  document.getElementById('weeklyLimitProgress').textContent = `${Math.min(weeklyProgress, 100).toFixed(0)}%`;
  document.getElementById('weeklyProgressBar').style.width = `${Math.min(weeklyProgress, 100)}%`;
  updateProgressBarColor('weeklyProgressBar', weeklyProgress);

  // Update monthly progress bar
  document.getElementById('monthlyLimitProgress').textContent = `${Math.min(monthlyProgress, 100).toFixed(0)}%`;
  document.getElementById('monthlyProgressBar').style.width = `${Math.min(monthlyProgress, 100)}%`;
  updateProgressBarColor('monthlyProgressBar', monthlyProgress);

  // Update yearly progress bar
  document.getElementById('yearlyLimitProgress').textContent = `${Math.min(yearlyProgress, 100).toFixed(0)}%`;
  document.getElementById('yearlyProgressBar').style.width = `${Math.min(yearlyProgress, 100)}%`;
  updateProgressBarColor('yearlyProgressBar', yearlyProgress);
}

// Helper function to update progress bar color based on progress percentage
function updateProgressBarColor(barId, progress) {
  const bar = document.getElementById(barId);
  if (progress >= 100) {
    bar.style.backgroundColor = 'red';
  } else if (progress >= 75) {
    bar.style.backgroundColor = 'orange';
  } else if (progress >= 50) {
    bar.style.backgroundColor = 'yellow';
  } else {
    bar.style.backgroundColor = 'green';
  }
}

// Show/Hide Spending Limits Logic
document.getElementById('toggleLimitsBtn')?.addEventListener('click', function () {
  const limitSection = document.getElementById('limitSection');
  const button = document.getElementById('toggleLimitsBtn');

  if (limitSection.classList.contains('hidden')) {
    limitSection.classList.remove('hidden');
    button.textContent = 'Hide Spending Limits';
  } else {
    limitSection.classList.add('hidden');
    button.textContent = 'Show Spending Limits';
  }
});

// Bottom navigation bar handling
document.getElementById('navBudgets')?.addEventListener('click', function () {
  navigateTo('main.html');
});
document.getElementById('navStarred')?.addEventListener('click', function () {
  navigateTo('starred.html');
});
document.getElementById('navSettings')?.addEventListener('click', function () {
  navigateTo('settings.html');
});
document.getElementById('navAccount')?.addEventListener('click', function () {
  navigateTo('account.html');
});

// Save currency symbol when "Save Currency" button is clicked
document.getElementById('saveCurrencyBtn')?.addEventListener('click', function (e) {
    e.preventDefault(); 
    const currencyInput = document.getElementById('currencyInput').value;

    if (currencyInput) {
        localStorage.setItem('currencySymbol', currencyInput); // Save the currency symbol
        alert('Currency symbol saved successfully!');
        
        // Re-render transactions and summary with the updated currency symbol
        renderBalanceSheets(); // Refresh the balance sheets
        const budgetTitle = balanceSheets[budgetIndex]?.title;
        renderTransactions(budgetTitle); // Refresh transactions
        calculateSummary(budgetTitle);  // Refresh summary
    } else {
        alert('Please select a valid currency.');
    }
});




// Initialize and apply the saved currency symbol throughout the app
function initializeCurrency() {
    const savedCurrencySymbol = localStorage.getItem('currencySymbol');

    // If a currency symbol is saved, apply it
    if (savedCurrencySymbol) {
        document.querySelectorAll('.currency').forEach(function (element) {
            element.textContent = savedCurrencySymbol;
        });
        console.log('Loaded currency symbol:', savedCurrencySymbol); // Debugging log
    }
}

function getCurrencySymbol() {
  return localStorage.getItem('currencySymbol') || '$'; // Default to USD ($)
}


window.onload = function () {
  initializeCurrency(); // Apply the saved currency symbol
  renderBalanceSheets(); // Render balance sheets
  
  if (balanceSheets[budgetIndex]) {
    const budgetTitle = balanceSheets[budgetIndex].title;
    renderTransactions(budgetTitle);  // Render transactions
    calculateSummary(budgetTitle);   // Calculate and render summary
  }
};

// Currency Settings Modal Logic
document.getElementById('saveCurrencyBtn')?.addEventListener('click', function () {
  const selectedCurrency = document.getElementById('currencyInput').value || '$';
  localStorage.setItem('currencySymbol', selectedCurrency);

  // Update the currency symbol throughout the app
  document.querySelectorAll('.currency-symbol').forEach((el) => {
    el.textContent = selectedCurrency;
  });

  document.getElementById('currencyModal').classList.remove('active');
});

// Function to update appearance settings (color and dark mode)
function updateAppearanceSettings() {
  // Get color selection
  const selectedColor = document.getElementById('colorPicker').value || '#9072a5'; // Default color
  
  // Get dark mode toggle state
  const darkModeEnabled = document.getElementById('darkModeToggle').checked;
  
  // Update CSS variables
  document.documentElement.style.setProperty('--main-color', selectedColor);

  if (darkModeEnabled) {
    document.documentElement.style.setProperty('--main-bg-color', '#333');
    document.documentElement.style.setProperty('--text-color', '#fff');
    document.documentElement.style.setProperty('--header-footer-text-color', '#fff');
  } else {
    document.documentElement.style.setProperty('--main-bg-color', '#f5f5f5');
    document.documentElement.style.setProperty('--text-color', '#000');
    document.documentElement.style.setProperty('--header-footer-text-color', '#fff');
  }
  
  // Save settings in localStorage
  localStorage.setItem('appColor', selectedColor);
  localStorage.setItem('darkMode', darkModeEnabled);
}

// Load settings from localStorage when the page loads
function loadAppearanceSettings() {
  const savedColor = localStorage.getItem('appColor') || '#9072a5';
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';

  document.getElementById('colorPicker').value = savedColor;
  document.getElementById('darkModeToggle').checked = savedDarkMode;

  // Apply the saved settings
  updateAppearanceSettings();
}

// Event listener for saving appearance settings
document.getElementById('saveAppearanceBtn').addEventListener('click', updateAppearanceSettings);

// Call function to load appearance settings when the page loads
window.onload = function () {
  loadAppearanceSettings();
};
