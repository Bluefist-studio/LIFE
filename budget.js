// ===============================
// SECTION: Accordion & Lock/Unlock Logic
// ===============================
// ===============================LOCK RETURN LOGIC===============================
// Ensure lock returns to locked by default when exiting the sub-category
document.addEventListener('DOMContentLoaded', function() {
  const housingBtn = document.getElementById('housingCategoryBtn');
  if (housingBtn) {
    housingBtn.addEventListener('click', function() {
      setTimeout(() => {
        const panel = housingBtn.nextElementSibling;
        if (panel && panel.style.display !== 'block') {
          const lockBtn = document.getElementById('lock-housing');
          if (lockBtn && lockBtn.dataset.locked !== 'true') {
            toggleLockHousing();
          }
        }
      }, 100);
    });
  }

  // Ensure lock returns to locked by default when exiting the Transport sub-category
  const transportBtn = document.getElementById('transportCategoryBtn');
  if (transportBtn) {
    transportBtn.addEventListener('click', function() {
      setTimeout(() => {
        const panel = transportBtn.nextElementSibling;
        if (panel && panel.style.display !== 'block') {
          const lockBtn = document.getElementById('lock-transport');
          if (lockBtn && lockBtn.dataset.locked !== 'true') {
            toggleLockTransport();
          }
        }
      }, 100);
    });
  }

  // Ensure lock returns to locked by default when exiting the Income sub-category
  const incomeBtn = Array.from(document.querySelectorAll('.budui-accordion-btn')).find(btn => btn.textContent.trim() === 'Income');
  if (incomeBtn) {
    incomeBtn.addEventListener('click', function() {
      setTimeout(() => {
        const panel = incomeBtn.nextElementSibling;
        if (panel && panel.style.display !== 'block') {
          const lockBtn = document.getElementById('lock-income');
          if (lockBtn && lockBtn.dataset.locked !== 'true') {
            toggleLockIncome();
          }
        }
      }, 100);
    });
  }

  // Ensure lock returns to locked by default when exiting the Multi-media sub-category
  const multimediaBtn = document.getElementById('multimediaCategoryBtn');
  if (multimediaBtn) {
    multimediaBtn.addEventListener('click', function() {
      setTimeout(() => {
        const panel = multimediaBtn.nextElementSibling;
        if (panel && panel.style.display !== 'block') {
          const lockBtn = document.getElementById('lock-multi-media');
          if (lockBtn && lockBtn.dataset.locked !== 'true') {
            toggleLockMultiMedia();
          }
        }
      }, 100);
    });
  }

  // Ensure lock returns to locked by default when exiting the Savings sub-category
  const savingsBtn = document.getElementById('savingsCategoryBtn');
  if (savingsBtn) {
    savingsBtn.addEventListener('click', function() {
      setTimeout(() => {
        const panel = savingsBtn.nextElementSibling;
        if (panel && panel.style.display !== 'block') {
          const lockBtn = document.getElementById('lock-savings');
          if (lockBtn && lockBtn.dataset.locked !== 'true') {
            toggleLockSavings();
          }
        }
      }, 100);
    });
  }

  // Ensure lock returns to locked by default when exiting the Others sub-category
  const othersBtn = document.getElementById('othersCategoryBtn');
  if (othersBtn) {
    othersBtn.addEventListener('click', function() {
      setTimeout(() => {
        const panel = othersBtn.nextElementSibling;
        if (panel && panel.style.display !== 'block') {
          const lockBtn = document.getElementById('lock-others');
          if (lockBtn && lockBtn.dataset.locked !== 'true') {
            toggleLockOthers();
          }
        }
      }, 100);
    });
  }
});


//===============================UPDATE TOTALS LOGIC=============================
// When locking/unlocking, update all totals in Budget Categories Accordion
function updateBudgetAccordionTotals() {
  // Update all sub-category totals and collect for each main category
  const mainCats = [
    { btn: document.getElementById('incomeCategoryTotalBtn'), panel: document.getElementById('incomeCategoryBtn')?.nextElementSibling },
    { btn: document.getElementById('housingCategoryTotalBtn'), panel: document.getElementById('housingCategoryBtn')?.nextElementSibling },
    { btn: document.getElementById('expensesCategoryTotalBtn'), panel: document.getElementById('budgetMenuBtn')?.nextElementSibling },
    { btn: document.getElementById('transportCategoryTotalBtn'), panel: document.getElementById('transportCategoryBtn')?.nextElementSibling },
    { btn: document.getElementById('multimediaCategoryTotalBtn'), panel: document.getElementById('multimediaCategoryBtn')?.nextElementSibling },
    { btn: document.getElementById('savingsCategoryTotalBtn'), panel: document.getElementById('savingsCategoryBtn')?.nextElementSibling },
    { btn: document.getElementById('othersCategoryTotalBtn'), panel: document.getElementById('othersCategoryBtn')?.nextElementSibling }
  ];

  mainCats.forEach(cat => {
    if (!cat.btn || !cat.panel) return;
    let catTotal = 0;
    // For Expenses, include all .budui-blocks in the main panel and all sub-panels (multi-media, savings, others)
    let blocks = Array.from(cat.panel.querySelectorAll('.budui-block'));
    if (cat.btn.id === 'expensesCategoryTotalBtn') {
      // Find all .budui-blocks in the main panel and all sibling panels until the next main category
      let next = cat.panel.nextElementSibling;
      while (next && next.classList.contains('budui-accordion-panel')) {
        blocks = blocks.concat(Array.from(next.querySelectorAll('.budui-block')));
        next = next.nextElementSibling;
      }
      // Also include .pip-item.budui-row (for multi-media, savings, others)
      let pipPanels = [];
      let pipNext = cat.panel.nextElementSibling;
      while (pipNext && pipNext.classList.contains('budui-accordion-panel')) {
        pipPanels.push(pipNext);
        pipNext = pipNext.nextElementSibling;
      }
      pipPanels.forEach(panel => {
        blocks = blocks.concat(Array.from(panel.querySelectorAll('.pip-item.budui-row')));
      });
    }
    blocks.forEach(block => {
      // For .budui-block or .pip-item.budui-row
      const first = block.querySelectorAll('.budui-half')[0];
      const second = block.querySelectorAll('.budui-half')[1];
      const totalField = block.querySelector('.budui-total');
      if (first && second && totalField) {
        // Always show forecast (sum of both fields)
        let total = (parseFloat(first.value) || 0) + (parseFloat(second.value) || 0);
        totalField.value = total.toFixed(2);
        // Mark total as paid if:
        // (both values filled and both paid) OR (first filled and paid, second empty) OR (second filled and paid, first empty)
        const firstFilled = first.value.trim() !== '';
        const secondFilled = second.value.trim() !== '';
        const firstPaid = first.classList.contains('budui-paid');
        const secondPaid = second.classList.contains('budui-paid');
        let paid = false;
        if ((firstFilled && secondFilled && firstPaid && secondPaid) ||
            (firstFilled && firstPaid && !secondFilled) ||
            (secondFilled && secondPaid && !firstFilled)) {
          paid = true;
        }
        if (paid) {
          totalField.classList.add('budui-paid');
        } else {
          totalField.classList.remove('budui-paid');
        }
        catTotal += total;
      }
    });
    cat.btn.textContent = `$${catTotal.toFixed(2)}`;
  });
  // Update summary totals
  updateSummaryTotals();
}

// Update the summary bar at the top
function updateSummaryTotals() {
  // --- Income forecast: sum all income sub-cat totals (ignore paid status)
    const spendingTotal = document.getElementById('spendingCategoryTotalBtn');
  let incomeForecast = 0;
  const incomePanel = document.getElementById('incomeCategoryBtn')?.nextElementSibling;
  if (incomePanel) {
    incomePanel.querySelectorAll('.budui-block').forEach(block => {
      const first = block.querySelectorAll('.budui-half')[0];
      const second = block.querySelectorAll('.budui-half')[1];
      if (first && second) {
        incomeForecast += (parseFloat(first.value) || 0) + (parseFloat(second.value) || 0);
      }
    });
  }

  // --- Income current: sum only paid income sub-cat totals
  let incomeCurrent = 0;
  if (incomePanel) {
    incomePanel.querySelectorAll('.budui-block').forEach(block => {
      const first = block.querySelectorAll('.budui-half')[0];
      const second = block.querySelectorAll('.budui-half')[1];
      if (first && second) {
        if (first.classList.contains('budui-paid')) incomeCurrent += parseFloat(first.value) || 0;
        if (second.classList.contains('budui-paid')) incomeCurrent += parseFloat(second.value) || 0;
      }
    });
  }

  // --- Expenses forecast: sum all expense sub-cat totals (ignore paid status) + spending
  let expensesForecast = 0;
  const expensesPanel = document.getElementById('budgetMenuBtn')?.nextElementSibling;
  if (expensesPanel) {
    expensesPanel.querySelectorAll('.budui-block').forEach(block => {
      const first = block.querySelectorAll('.budui-half')[0];
      const second = block.querySelectorAll('.budui-half')[1];
      if (first && second) {
        expensesForecast += (parseFloat(first.value) || 0) + (parseFloat(second.value) || 0);
      }
    });
  }
  // Expenses forecast does NOT include spending

  // --- Expenses current: sum only paid expense sub-cat totals + spending
  let expensesCurrent = 0;
  if (expensesPanel) {
    expensesPanel.querySelectorAll('.budui-block').forEach(block => {
      const first = block.querySelectorAll('.budui-half')[0];
      const second = block.querySelectorAll('.budui-half')[1];
      if (first && second) {
        if (first.classList.contains('budui-paid')) expensesCurrent += parseFloat(first.value) || 0;
        if (second.classList.contains('budui-paid')) expensesCurrent += parseFloat(second.value) || 0;
      }
    });
  }
  // Add spending current (spending has no paid status, so always add)
  if (spendingTotal) {
    expensesCurrent += parseFloat(spendingTotal.textContent.replace(/[^\d.\-]/g, '')) || 0;
  }

  // --- Remaining forecast: income forecast - expenses forecast
  const remainingForecast = incomeForecast - expensesForecast;
  // --- Remaining current: income current - expenses current
  const remainingCurrent = incomeCurrent - expensesCurrent;

  // Update summary bar
  const buduiIncome = document.getElementById('buduiIncome');
  const buduiExpenses = document.getElementById('buduiExpenses');
  const buduiRemainingForecast = document.getElementById('buduiRemainingForecast');
  const buduiRemainingCurrent = document.getElementById('buduiRemainingCurrent');
  if (buduiIncome) buduiIncome.textContent = `$${incomeForecast.toFixed(2)}`;
  if (buduiExpenses) buduiExpenses.textContent = `$${expensesForecast.toFixed(2)}`;
  if (buduiRemainingForecast) buduiRemainingForecast.textContent = `$${remainingForecast.toFixed(2)}`;
  if (buduiRemainingCurrent) buduiRemainingCurrent.textContent = `$${remainingCurrent.toFixed(2)}`;

  // Update progress bar: Remaining Forecast vs Spending total
  const buduiProgressBar = document.getElementById('buduiProgressBar');
  const buduiProgressRemainingForecast = document.getElementById('buduiProgressRemainingForecast');
  const buduiProgressSpending = document.getElementById('buduiProgressSpending');
  let spendingValue = 0;
  if (spendingTotal) {
    spendingValue = parseFloat(spendingTotal.textContent.replace(/[^\d.\-]/g, '')) || 0;
  }
  if (buduiProgressRemainingForecast) buduiProgressRemainingForecast.textContent = `$${remainingForecast.toFixed(2)}`;
  if (buduiProgressSpending) buduiProgressSpending.textContent = `$${spendingValue.toFixed(2)}`;
  if (buduiProgressBar) {
    // Show Remaining Forecast minus Spending as the bar value
    let barValue = remainingForecast - spendingValue;
    // Clamp to 0 if negative
    if (barValue < 0) barValue = 0;
    // Calculate percent of original Remaining Forecast
    let percent = 0;
    if (remainingForecast > 0) {
      percent = Math.min(100, (barValue / remainingForecast) * 100);
    }
    buduiProgressBar.style.width = percent + '%';
    // Optionally, update the label to show the difference
    if (buduiProgressRemainingForecast) buduiProgressRemainingForecast.textContent = `$${barValue.toFixed(2)}`;
  }
}



// ===============================
// SECTION: Helpers
// ===============================

// Format amounts as currency
function formatAmount(val) {
  let num = parseFloat(val);
  if (isNaN(num)) num = 0;
  return `$${num.toFixed(2)}`;
}



// SECTION: DOM LISTENERS FOR FIREBASE
// ===============================
// On DOM ready, set up listeners for loading/saving income
document.addEventListener("DOMContentLoaded", function() {
  // Load income, housing, transport, multi-media, savings, and others from Firestore on login (after DOM is ready)
  auth.onAuthStateChanged(function(user) {
    const incomePanel = document.querySelector('#incomeCategoryBtn')?.nextElementSibling;
    const housingPanel = document.querySelector('#housingCategoryBtn')?.nextElementSibling;
    const transportPanel = document.querySelector('#transportCategoryBtn')?.nextElementSibling;
    const multimediaPanel = document.querySelector('#multimediaCategoryBtn')?.nextElementSibling;
    const savingsPanel = document.querySelector('#savingsCategoryBtn')?.nextElementSibling;
    const othersPanel = document.querySelector('#othersCategoryBtn')?.nextElementSibling;
    if (user && incomePanel) {
      loadIncomeFromFirestore();
    }
    if (user && housingPanel) {
      loadHousingFromFirestore();
    }
    if (user && transportPanel) {
      loadTransportFromFirestore();
    }
    if (user && multimediaPanel && typeof loadMultiMediaFromFirestore === 'function') {
      loadMultiMediaFromFirestore();
    }
    if (user && savingsPanel && typeof loadSavingsFromFirestore === 'function') {
      loadSavingsFromFirestore();
    }
    if (user && othersPanel && typeof loadOthersFromFirestore === 'function') {
      loadOthersFromFirestore();
    }
  });
// ===============================


  //==============================ACCORDION LOGIC=============================
  // Accordion expand/collapse logic
  document.querySelectorAll('.budui-accordion-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = btn.getAttribute('data-target');
      const panel = document.getElementById(targetId);
      if (!panel) return;
      const isOpen = panel.style.display === 'block';
      // Close all panels
      document.querySelectorAll('.budui-accordion-panel').forEach(p => p.style.display = 'none');
      // Open this one if it was closed
      if (!isOpen) panel.style.display = 'block';
    });
  });


  //==============================BUDGET DASHBOARD RENDERING=============================
  // Persistent login: listen for auth state changes
  auth.onAuthStateChanged(function(user) {
    const appView = document.getElementById("appView");
    const loginView = document.getElementById("loginView");
    if (!appView || !loginView) return;
    if (user) {
      // User is signed in, show dashboard
      loginView.classList.add("hidden");
      appView.classList.remove("hidden");
      // Hide daily quote if present
      var dailyQuote = document.getElementById("dailyQuote");
      if (dailyQuote) dailyQuote.style.display = "none";
      renderBudgetDashboard();
    } else {
      // User is signed out, show login
      appView.classList.add("hidden");
      loginView.classList.remove("hidden");
    }
  });


  //==============================INITIAL CHECK=============================
  // Only run if on Budget UI and user is logged in (appView is visible)
  const appView = document.getElementById("appView");
  const loginView = document.getElementById("loginView");
  if (!appView || !loginView) return;

  // Observe login/appView visibility
  const observer = new MutationObserver(() => {
    if (!appView.classList.contains("hidden") && loginView.classList.contains("hidden")) {
      renderBudgetDashboard();
    }
  });
  observer.observe(appView, { attributes: true, attributeFilter: ["class"] });
  observer.observe(loginView, { attributes: true, attributeFilter: ["class"] });

  // Show the dashboard and attach events
  async function renderBudgetDashboard() {
    // Show dashboard panel and clear dynamic content
    if (document.getElementById("dashboardPanel")) {
      document.getElementById("dashboardPanel").style.display = "block";
    }
    const dashboardContent = document.getElementById("dashboardContent");
    if (dashboardContent) dashboardContent.innerHTML = "";

    // Link login button to dashboard (after successful login)
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
      loginBtn.addEventListener("click", function() {
        setTimeout(() => {
          if (!appView.classList.contains("hidden") && loginView.classList.contains("hidden")) {
            renderBudgetDashboard();
          }
        }, 500); // Wait for login logic to complete
      });
    }
  }


  //==============================SPENDING MODAL LOGIC=============================
  // --- Spending Entries State ---
  let spendingEntries = [];
  // --- Firestore Save/Load for Spending ---
  async function saveSpendingToFirestore() {
    const user = auth.currentUser;
    if (!user) return;
    await db.collection('users').doc(user.uid).collection('budget').doc('spending').set({ entries: spendingEntries });
  }

  async function loadSpendingFromFirestore() {
    const user = auth.currentUser;
    if (!user) return;
    const doc = await db.collection('users').doc(user.uid).collection('budget').doc('spending').get();
    if (!doc.exists) return;
    const { entries } = doc.data();
    if (Array.isArray(entries)) {
      spendingEntries = entries;
      renderSpendingList();
    }
  }
  let editingSpendingIndex = null;

  // --- Spending Modal Logic ---
  const addSpendingBtn = document.getElementById('addSpendingBtn');
  const spendingList = document.getElementById('spendingList');
  const spendingTotal = document.getElementById('spendingTotal');
  const entryModal = document.getElementById('buduiEntryModal');
  const modalEdit = document.getElementById('modalEntryEdit');
  const modalInfo = document.getElementById('modalEntryInfo');
  const modalEditDesc = document.getElementById('modalEditDesc');
  const modalEditAmt = document.getElementById('modalEditAmt');
  const modalEditConfirmBtn = document.getElementById('modalEditConfirmBtn');
  const closeEntryModal = document.getElementById('closeEntryModal');
  const modalEditBtn = document.getElementById('modalEditBtn');
  const modalDeleteBtn = document.getElementById('modalDeleteBtn');
  const modalEditInitBtn = document.getElementById('modalEditInitBtn');
  const modalEditInitDeleteBtn = document.getElementById('modalEditInitDeleteBtn');
  const modalEditInitCancelBtn = document.getElementById('modalEditInitCancelBtn');

  function openSpendingModal(mode, entryIdx = null) {
    entryModal.style.display = 'block';
    const modalEditBtnRow = document.getElementById('modalEditBtnRow');
    const modalEditInitBtnRow = document.getElementById('modalEditInitBtnRow');
    const modalInfoBtnRow = document.getElementById('modalInfoBtnRow');
    if (mode === 'add') {
      modalEdit.style.display = 'flex';
      modalInfo.style.display = 'none';
      modalEditBtnRow.style.display = 'flex';
      if (modalEditInitBtnRow) modalEditInitBtnRow.style.display = 'none';
      if (modalInfoBtnRow) modalInfoBtnRow.style.display = 'none';
      modalEditDesc.value = '';
      modalEditAmt.value = '';
      editingSpendingIndex = null;
      modalEditConfirmBtn.textContent = 'Add';
    } else if (mode === 'edit' && entryIdx !== null) {
      // Initial edit view: show fields, but with Edit/Delete/Cancel
      modalEdit.style.display = 'flex';
      modalInfo.style.display = 'none';
      if (modalEditBtnRow) modalEditBtnRow.style.display = 'none';
      if (modalEditInitBtnRow) modalEditInitBtnRow.style.display = 'flex';
      if (modalInfoBtnRow) modalInfoBtnRow.style.display = 'none';
      const entry = spendingEntries[entryIdx];
      modalEditDesc.value = entry.desc;
      modalEditAmt.value = entry.amt;
      editingSpendingIndex = entryIdx;
    } else if (mode === 'info' && entryIdx !== null) {
      modalEdit.style.display = 'none';
      modalInfo.style.display = 'block';
      if (modalEditBtnRow) modalEditBtnRow.style.display = 'none';
      if (modalEditInitBtnRow) modalEditInitBtnRow.style.display = 'none';
      if (modalInfoBtnRow) modalInfoBtnRow.style.display = 'flex';
      const entry = spendingEntries[entryIdx];
      document.getElementById('modalEntryDesc').textContent = entry.desc;
      document.getElementById('modalEntryAmount').textContent = formatAmount(entry.amt);
      editingSpendingIndex = entryIdx;
    }
  }

  function closeSpendingModal() {
    entryModal.style.display = 'none';
    editingSpendingIndex = null;
  }

  function renderSpendingList() {
    if (!spendingEntries.length) {
      spendingList.textContent = 'No spending entries yet.';
    } else {
      spendingList.innerHTML = '';
      spendingEntries.forEach((entry, idx) => {
        const div = document.createElement('div');
        div.className = 'budui-list-entry';
        div.textContent = `${entry.desc} - ${formatAmount(entry.amt)}`;
        div.style.cursor = 'pointer';
        div.onclick = () => openSpendingModal('edit', idx);
        spendingList.appendChild(div);
      });
    }
    // Update total
    const total = spendingEntries.reduce((sum, e) => sum + parseFloat(e.amt || 0), 0);
    const spendingPanelTotal = document.getElementById('spendingPanelTotal');
    if (spendingPanelTotal) spendingPanelTotal.textContent = `Total: ${formatAmount(total)}`;
    const catBtn = document.getElementById('spendingCategoryTotalBtn');
    if (catBtn) catBtn.textContent = formatAmount(total);
    const progSpend = document.getElementById('buduiProgressSpending');
    if (progSpend) progSpend.textContent = formatAmount(total);
    // Save to Firestore on every change
    saveSpendingToFirestore();
  }

  if (addSpendingBtn) {
    addSpendingBtn.onclick = () => openSpendingModal('add');
  }
  if (closeEntryModal) {
    closeEntryModal.onclick = closeSpendingModal;
  }
  if (modalEditInitCancelBtn) {
    modalEditInitCancelBtn.onclick = closeSpendingModal;
  }
  if (modalEditInitBtn) {
    modalEditInitBtn.onclick = function() {
      // Switch to edit-after-edit mode (show Save/Cancel)
      const modalEditBtnRow = document.getElementById('modalEditBtnRow');
      const modalEditInitBtnRow = document.getElementById('modalEditInitBtnRow');
      if (modalEditBtnRow) modalEditBtnRow.style.display = 'flex';
      if (modalEditInitBtnRow) modalEditInitBtnRow.style.display = 'none';
      modalEditConfirmBtn.textContent = 'Save';
    };
  }
  if (modalEditInitDeleteBtn) {
    modalEditInitDeleteBtn.onclick = function() {
      if (editingSpendingIndex !== null) {
        if (confirm('Delete this spending entry?')) {
          spendingEntries.splice(editingSpendingIndex, 1);
          renderSpendingList();
          closeSpendingModal();
        }
      }
    };
  }
  // Load spending from Firestore on login
  auth.onAuthStateChanged(function(user) {
    if (user) {
      loadSpendingFromFirestore();
    } else {
      spendingEntries = [];
      renderSpendingList();
    }
  });
  if (modalEditConfirmBtn) {
    modalEditConfirmBtn.onclick = function() {
      const desc = modalEditDesc.value.trim();
      const amt = parseFloat(modalEditAmt.value);
      if (!desc || isNaN(amt)) {
        alert('Please enter a description and amount.');
        return;
      }
      if (editingSpendingIndex === null) {
        // Add new
        spendingEntries.push({ desc, amt });
      } else {
        // Edit existing
        spendingEntries[editingSpendingIndex] = { desc, amt };
      }
      renderSpendingList();
      updateBudgetAccordionTotals();
      closeSpendingModal();
    };
  }
  if (modalEditBtn) {
    modalEditBtn.onclick = function() {
      if (editingSpendingIndex !== null) {
        // Switch to edit mode
        const modalEditBtnRow = document.getElementById('modalEditBtnRow');
        const modalInfoBtnRow = document.getElementById('modalInfoBtnRow');
        modalEdit.style.display = 'flex';
        modalInfo.style.display = 'none';
        if (modalEditBtnRow) modalEditBtnRow.style.display = 'flex';
        if (modalInfoBtnRow) modalInfoBtnRow.style.display = 'none';
        const entry = spendingEntries[editingSpendingIndex];
        modalEditDesc.value = entry.desc;
        modalEditAmt.value = entry.amt;
        modalEditConfirmBtn.textContent = 'Save';
      }
    };
  }
  if (modalDeleteBtn) {
    modalDeleteBtn.onclick = function() {
      if (editingSpendingIndex !== null) {
        if (confirm('Delete this spending entry?')) {
          spendingEntries.splice(editingSpendingIndex, 1);
          renderSpendingList();
          closeSpendingModal();
        }
      }
    };
  }

  // Initial render
  renderSpendingList();

}); // <-- Close DOMContentLoaded event handler
