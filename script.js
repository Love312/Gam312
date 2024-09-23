// Utility function to navigate between pages
function navigateTo(page) {
  window.location.href = page;
}

// Developer Mode Button
document.getElementById('devModeBtn')?.addEventListener('click', function () {
  // Navigate to the main page in developer mode without login
  console.log("Developer Mode button clicked."); // For debugging
  navigateTo('main.html');
});

// Add event listener for the login form submission
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Validate the login (this is a simple local storage validation for testing purposes)
  const storedUsername = window.localStorage.getItem('username');
  const storedPassword = window.localStorage.getItem('password');

  if (username === storedUsername && password === storedPassword) {
    navigateTo("main.html");
  } else {
    alert("Invalid username or password");
  }
});

// Initialize balance sheets (example data, can be pulled from local storage)
let balanceSheets = JSON.parse(localStorage.getItem('balanceSheets')) || [];

// Render the balance sheets with the options button appearing first
function renderBalanceSheets() {
  const budgetPages = document.getElementById('budgetPages');
  if (!budgetPages) return;  // Ensure the container exists

  budgetPages.innerHTML = ''; // Clear existing budgets

  balanceSheets.forEach((sheet, index) => {
    const budgetItem = document.createElement('div');
    budgetItem.classList.add('budget-item');
    budgetItem.innerHTML = `
      <!-- More Options Button (Appears First) -->
      <div class="more-options">
        <button class="more-btn">⋮</button>
        <div class="dropdown-content">
          <button class="rename-btn" data-index="${index}">Rename</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
          <button class="duplicate-btn" data-index="${index}">Duplicate</button>
        </div>
      </div>

      <!-- Budget Title -->
      <span class="description">${sheet.title}</span>

      <!-- Budget Amount -->
      <span class="amount">+ $${sheet.amount.toFixed(2)}</span>
    `;

    budgetPages.appendChild(budgetItem);

    // Make the budget item clickable to open the custom balance sheet
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
}

// Initialize transactions from localStorage or set to an empty object
let transactions = JSON.parse(localStorage.getItem('transactions')) || {};

// Function to render the transaction list with options
function renderTransactions(budgetTitle) {
  const transactionsList = transactions[budgetTitle] || [];
  const transactionsContainer = document.getElementById('transactions');
  transactionsContainer.innerHTML = '';

  transactionsList.forEach((transaction, index) => {
    const transactionItem = document.createElement('div');
    transactionItem.classList.add('transaction-item');
    transactionItem.innerHTML = `
      <div class="transaction-details">
        <p>${transaction.details}</p>
        <p>${transaction.date}</p>
      </div>
      <p class="transaction-amount ${transaction.type}">${transaction.type === 'income' ? '+' : '-'} $${transaction.amount.toFixed(2)}</p>

      <!-- More Options Menu for each transaction -->
      <div class="transaction-options">
        <button class="more-btn">⋮</button>
        <div class="transaction-dropdown-content">
          <button class="edit-transaction-btn" data-index="${index}">Edit</button>
          <button class="delete-transaction-btn" data-index="${index}">Delete</button>
          <button class="duplicate-transaction-btn" data-index="${index}">Duplicate</button>
        </div>
      </div>
    `;

    transactionsContainer.appendChild(transactionItem);

    // More Options Dropdown interaction
    const moreBtn = transactionItem.querySelector('.more-btn');
    const transactionOptions = transactionItem.querySelector('.transaction-options');

    moreBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      transactionOptions.classList.toggle('active'); // Toggle visibility
    });

    // Edit Transaction
    const editBtn = transactionItem.querySelector('.edit-transaction-btn');
    editBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      openEditTransactionModal(index, budgetTitle);
    });

    // Delete Transaction
    const deleteBtn = transactionItem.querySelector('.delete-transaction-btn');
    deleteBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      deleteTransaction(index, budgetTitle);
    });

    // Duplicate Transaction
    const duplicateBtn = transactionItem.querySelector('.duplicate-transaction-btn');
    duplicateBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      duplicateTransaction(index, budgetTitle);
    });
  });
}

// Open modal to edit a transaction
function openEditTransactionModal(index, budgetTitle) {
  // Ensure the transaction is properly retrieved
  const transaction = transactions[budgetTitle][index]; 
  if (!transaction) {
    console.error('Transaction not found');
    return;
  }

  // Populate modal fields with transaction data
  document.getElementById('transactionAmount').value = transaction.amount;
  document.getElementById('transactionDate').value = transaction.date;
  document.getElementById('transactionDetails').value = transaction.details;

  // Update save button behavior to modify existing transaction
  document.getElementById('saveTransactionBtn').onclick = function () {
    const newAmount = parseFloat(document.getElementById('transactionAmount').value);
    const newDate = document.getElementById('transactionDate').value;
    const newDetails = document.getElementById('transactionDetails').value;

    if (newAmount && newDate && newDetails) {
      transactions[budgetTitle][index] = { 
        amount: newAmount, 
        date: newDate, 
        details: newDetails, 
        type: transaction.type  // Keep the original transaction type
      };
      localStorage.setItem('transactions', JSON.stringify(transactions));
      renderTransactions(budgetTitle);
      document.getElementById('transactionModal').classList.remove('active');
    } else {
      alert('Please fill out all fields.');
    }
  };

  document.getElementById('transactionModal').classList.add('active');
}

// Delete a transaction
function deleteTransaction(index, budgetTitle) {
  transactions[budgetTitle].splice(index, 1);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  renderTransactions(budgetTitle);
}

// Duplicate a transaction
function duplicateTransaction(index, budgetTitle) {
  const transaction = transactions[budgetTitle][index]; // Ensure transaction is retrieved
  if (transaction) {
    const newTransaction = { ...transaction }; // Clone the transaction object
    transactions[budgetTitle].push(newTransaction); // Add the cloned transaction
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransactions(budgetTitle);
  } else {
    console.error('Transaction not found for duplication');
  }
}

// Close transaction modal
document.getElementById('closeModal').addEventListener('click', function () {
  document.getElementById('transactionModal').classList.remove('active');
});







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
document.getElementById('navBudgets').addEventListener('click', function () {
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

// Initialize the page and render budgets
window.onload = function () {
  renderBalanceSheets();
};
