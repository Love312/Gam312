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
let balanceSheets = JSON.parse(localStorage.getItem('balanceSheets')) || [
  { title: 'PC', amount: 3.27 },
  { title: 'RBC', amount: 5.75 },
  { title: 'October 1', amount: 2.36 }
];

// Render the balance sheets with the options button
function renderBalanceSheets() {
  const budgetPages = document.getElementById('budgetPages');
  if (!budgetPages) return;  // Ensure the container exists

  budgetPages.innerHTML = ''; // Clear existing budgets

  balanceSheets.forEach((sheet, index) => {
    const budgetItem = document.createElement('div');
    budgetItem.classList.add('budget-item');
    budgetItem.innerHTML = `
      <span class="description">${sheet.title}</span>
      <span class="amount">+ $${sheet.amount.toFixed(2)}</span>

      <!-- More Options Button -->
      <div class="more-options">
        <button class="more-btn">⋮</button>
        <div class="dropdown-content">
          <button class="rename-btn" data-index="${index}">Rename</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
          <button class="duplicate-btn" data-index="${index}">Duplicate</button>
        </div>
      </div>
    `;

    budgetPages.appendChild(budgetItem);

    // Add event listeners for options
    const moreBtn = budgetItem.querySelector('.more-btn');
    const renameBtn = budgetItem.querySelector('.rename-btn');
    const deleteBtn = budgetItem.querySelector('.delete-btn');
    const duplicateBtn = budgetItem.querySelector('.duplicate-btn');

    // Toggle options dropdown
    moreBtn.addEventListener('click', function () {
      const options = budgetItem.querySelector('.dropdown-content');
      options.style.display = options.style.display === 'block' ? 'none' : 'block';
    });

    // Rename function
    renameBtn.addEventListener('click', function () {
      openRenameModal(index); // Pass index to rename modal
    });

    // Delete function
    deleteBtn.addEventListener('click', function () {
      balanceSheets.splice(index, 1); // Remove from array
      localStorage.setItem('balanceSheets', JSON.stringify(balanceSheets)); // Update local storage
      renderBalanceSheets(); // Re-render budget list
    });

    // Duplicate function
    duplicateBtn.addEventListener('click', function () {
      const newBudget = { ...balanceSheets[index], title: `${balanceSheets[index].title} Copy` };
      balanceSheets.push(newBudget); // Add duplicated budget
      localStorage.setItem('balanceSheets', JSON.stringify(balanceSheets)); // Update local storage
      renderBalanceSheets(); // Re-render budget list
    });
  });
}

// Open Rename Modal and handle renaming
function openRenameModal(index) {
  const renameModal = document.getElementById('renameModal');
  const renameInput = document.getElementById('renameBudgetInput');
  if (!renameModal || !renameInput) return; // Ensure modal and input exist

  renameModal.classList.add('active');
  renameInput.value = balanceSheets[index].title;

  document.getElementById('saveRenameBtn').onclick = function () {
    const newTitle = renameInput.value;
    if (newTitle) {
      balanceSheets[index].title = newTitle;
      localStorage.setItem('balanceSheets', JSON.stringify(balanceSheets));
      renderBalanceSheets();
      renameModal.classList.remove('active'); // Close the modal
    } else {
      alert('Please enter a valid title.');
    }
  };

  // Close modal
  document.getElementById('closeRenameModal').onclick = function () {
    renameModal.classList.remove('active');
  };
}

// Add Budget Modal Logic
document.getElementById('addBudgetBtn')?.addEventListener('click', function () {
  // Open the modal for adding a budget
  document.getElementById('budgetModal').classList.add('active');
});

// Close Add Budget Modal
document.getElementById('closeModal')?.addEventListener('click', function () {
  document.getElementById('budgetModal').classList.remove('active');
});

// Save the New Budget and Add it to the List
document.getElementById('saveBudgetBtn')?.addEventListener('click', function () {
  const budgetTitle = document.getElementById('budgetTitleInput').value;

  if (budgetTitle) {
    // Add new budget to the list
    const newBudget = {
      title: budgetTitle,
      amount: 0 // Default amount for a new budget
    };

    balanceSheets.push(newBudget); // Add new budget to the array
    localStorage.setItem('balanceSheets', JSON.stringify(balanceSheets)); // Update local storage
    renderBalanceSheets(); // Re-render the budget list

    // Clear the input and close the modal
    document.getElementById('budgetTitleInput').value = '';
    document.getElementById('budgetModal').classList.remove('active');
  } else {
    alert('Please enter a budget title.');
  }
});

// Bottom navigation bar handling (example for navigation buttons)
document.getElementById('navBudgets')?.addEventListener('click', function () {
  navigateTo('main.html');
});
document.getElementById('navStarred')?.addEventListener('click', function () {
  navigateTo('starred.html'); // Placeholder for starred page
});
document.getElementById('navSettings')?.addEventListener('click', function () {
  navigateTo('settings.html'); // Placeholder for settings page
});
document.getElementById('navAccount')?.addEventListener('click', function () {
  navigateTo('account.html'); // Placeholder for account page
});

// Initialize the page and render budgets
window.onload = function () {
  renderBalanceSheets();
};