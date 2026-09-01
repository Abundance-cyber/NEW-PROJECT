/* =========================================================
   NAIRAPULSE - MAIN APPLICATION STORAGE
   =========================================================
   Handles:
   - Transactions
   - Savings Goals
   - Budgets
   - LocalStorage
   - Dashboard calculations

   IMPORTANT:
   Transaction and Savings functions are preserved.
   Budget spending is now entered manually from budget.js.
   ========================================================= */


/* =========================================================
   STORAGE KEYS
   ========================================================= */

const NAIRAPULSE_STORAGE = {
    transactions: "nairapulseTransactions",
    budgets: "nairapulseBudgets",
    savingsGoals: "nairapulseGoals"
};


/* =========================================================
   DEFAULT DATA
   ========================================================= */

const defaultTransactions = [
    {
        id: 1,
        type: "income",
        title: "Salary",
        category: "Income",
        amount: 12000,
        date: "2026-06-01"
    },
    {
        id: 2,
        type: "expense",
        title: "Food",
        category: "Food",
        amount: 1250,
        date: "2026-06-05"
    },
    {
        id: 3,
        type: "expense",
        title: "Rent",
        category: "Rent",
        amount: 1800,
        date: "2026-06-08"
    },
    {
        id: 4,
        type: "expense",
        title: "Transportation",
        category: "Transportation",
        amount: 850,
        date: "2026-06-10"
    },
    {
        id: 5,
        type: "expense",
        title: "Utilities",
        category: "Utilities",
        amount: 450,
        date: "2026-06-12"
    },
    {
        id: 6,
        type: "expense",
        title: "Shopping",
        category: "Shopping",
        amount: 300,
        date: "2026-06-15"
    },
    {
        id: 7,
        type: "expense",
        title: "Entertainment",
        category: "Entertainment",
        amount: 200,
        date: "2026-06-18"
    }
];


const defaultBudgets = [
    {
        id: 1,
        category: "Food",
        amount: 3000,
        spent: 0,
        period: "monthly"
    },
    {
        id: 2,
        category: "Rent",
        amount: 4000,
        spent: 0,
        period: "monthly"
    },
    {
        id: 3,
        category: "Transportation",
        amount: 2500,
        spent: 0,
        period: "monthly"
    },
    {
        id: 4,
        category: "Utilities",
        amount: 2500,
        spent: 0,
        period: "monthly"
    },
    {
        id: 5,
        category: "Shopping",
        amount: 2000,
        spent: 0,
        period: "monthly"
    },
    {
        id: 6,
        category: "Entertainment",
        amount: 1000,
        spent: 0,
        period: "monthly"
    }
];


const defaultSavingsGoals = [
    {
        id: 1,
        name: "Emergency Fund",
        target: 100000,
        saved: 45000,
        targetDate: "2026-12-31"
    },
    {
        id: 2,
        name: "New Laptop",
        target: 80000,
        saved: 35000,
        targetDate: "2026-10-15"
    },
    {
        id: 3,
        name: "Vacation",
        target: 60000,
        saved: 25000,
        targetDate: "2026-08-20"
    }
];


/* =========================================================
   FORMAT NAIRA
   ========================================================= */

function formatNaira(amount) {

    return "₦" +
        Number(amount || 0).toLocaleString(
            "en-NG",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


/* =========================================================
   SAFE STORAGE READER
   ========================================================= */

function getStoredData(key, fallback) {

    try {

        const saved =
            localStorage.getItem(key);

        if (!saved) {
            return fallback;
        }

        const parsed =
            JSON.parse(saved);

        if (Array.isArray(parsed)) {
            return parsed;
        }

        return fallback;

    } catch (error) {

        console.error(
            "Error reading localStorage:",
            key,
            error
        );

        return fallback;
    }

}


/* =========================================================
   TRANSACTIONS
   ========================================================= */

function getTransactions() {

    return getStoredData(
        NAIRAPULSE_STORAGE.transactions,
        defaultTransactions
    );

}


function saveTransactions(data) {

    localStorage.setItem(
        NAIRAPULSE_STORAGE.transactions,
        JSON.stringify(data)
    );

}


/* =========================================================
   BUDGETS
   ========================================================= */

function getBudgets() {

    const budgets =
        getStoredData(
            NAIRAPULSE_STORAGE.budgets,
            defaultBudgets
        );

    /*
       Make sure old budgets that do not have
       a "spent" property receive one.
    */

    return budgets.map(function (budget) {

        if (budget.spent === undefined) {
            budget.spent = 0;
        }

        if (budget.period === undefined) {
            budget.period = "monthly";
        }

        return budget;

    });

}


function saveBudgets(data) {

    localStorage.setItem(
        NAIRAPULSE_STORAGE.budgets,
        JSON.stringify(data)
    );

}


/* =========================================================
   SAVINGS GOALS
   ========================================================= */

function getSavingsGoals() {

    return getStoredData(
        NAIRAPULSE_STORAGE.savingsGoals,
        defaultSavingsGoals
    );

}


function saveSavingsGoals(data) {

    localStorage.setItem(
        NAIRAPULSE_STORAGE.savingsGoals,
        JSON.stringify(data)
    );

}


/* =========================================================
   INITIALIZE STORAGE
   ========================================================= */

function initializeNairaPulse() {

    if (
        !localStorage.getItem(
            NAIRAPULSE_STORAGE.transactions
        )
    ) {

        saveTransactions(
            defaultTransactions
        );

    }


    if (
        !localStorage.getItem(
            NAIRAPULSE_STORAGE.budgets
        )
    ) {

        saveBudgets(
            defaultBudgets
        );

    }


    if (
        !localStorage.getItem(
            NAIRAPULSE_STORAGE.savingsGoals
        )
    ) {

        saveSavingsGoals(
            defaultSavingsGoals
        );

    }

}


/* =========================================================
   DASHBOARD - TRANSACTIONS
   ========================================================= */

function getTotalIncome() {

    return getTransactions()

        .filter(function (transaction) {

            return transaction.type === "income";

        })

        .reduce(function (total, transaction) {

            return total +
                Number(transaction.amount || 0);

        }, 0);

}


function getTotalExpenses() {

    return getTransactions()

        .filter(function (transaction) {

            return transaction.type === "expense";

        })

        .reduce(function (total, transaction) {

            return total +
                Number(transaction.amount || 0);

        }, 0);

}


function getTotalBalance() {

    return (
        getTotalIncome() -
        getTotalExpenses()
    );

}


function getSavingsRate() {

    const income =
        getTotalIncome();

    const balance =
        getTotalBalance();

    if (income <= 0) {
        return 0;
    }

    return (
        balance / income
    ) * 100;

}


/* =========================================================
   EXPENSES BY CATEGORY
   ========================================================= */

function getExpensesByCategory() {

    const transactions =
        getTransactions();

    const categories = {};

    transactions

        .filter(function (transaction) {

            return transaction.type === "expense";

        })

        .forEach(function (transaction) {

            const category =
                transaction.category ||
                "Other";

            if (!categories[category]) {
                categories[category] = 0;
            }

            categories[category] +=
                Number(transaction.amount || 0);

        });

    return categories;

}


/* =========================================================
   UPDATE DASHBOARD VALUES
   ========================================================= */

function updateDashboardValues() {

    const balance =
        getTotalBalance();

    const income =
        getTotalIncome();

    const expenses =
        getTotalExpenses();

    const savingsRate =
        getSavingsRate();


    document
        .querySelectorAll(
            '[data-value="balance"]'
        )
        .forEach(function (element) {

            element.textContent =
                formatNaira(balance);

        });


    document
        .querySelectorAll(
            '[data-value="income"]'
        )
        .forEach(function (element) {

            element.textContent =
                formatNaira(income);

        });


    document
        .querySelectorAll(
            '[data-value="expenses"]'
        )
        .forEach(function (element) {

            element.textContent =
                formatNaira(expenses);

        });


    document
        .querySelectorAll(
            '[data-value="savingsRate"]'
        )
        .forEach(function (element) {

            element.textContent =
                savingsRate.toFixed(1) + "%";

        });

}


/* =========================================================
   UPDATE BUDGET VALUES
   ========================================================= */

function updateBudgetValues() {

    const budgets =
        getBudgets();

    let totalBudget = 0;
    let totalSpent = 0;


    budgets.forEach(function (budget) {

        totalBudget +=
            Number(budget.amount || 0);

        totalSpent +=
            Number(budget.spent || 0);

    });


    const remaining =
        totalBudget - totalSpent;


    const usage =
        totalBudget > 0
            ? (totalSpent / totalBudget) * 100
            : 0;


    document
        .querySelectorAll(
            '[data-budget="total"]'
        )
        .forEach(function (element) {

            element.textContent =
                formatNaira(totalBudget);

        });


    document
        .querySelectorAll(
            '[data-budget="spent"]'
        )
        .forEach(function (element) {

            element.textContent =
                formatNaira(totalSpent);

        });


    document
        .querySelectorAll(
            '[data-budget="remaining"]'
        )
        .forEach(function (element) {

            element.textContent =
                formatNaira(remaining);

        });


    document
        .querySelectorAll(
            '[data-budget="usage"]'
        )
        .forEach(function (element) {

            element.textContent =
                usage.toFixed(1) + "%";

        });

}


/* =========================================================
   UPDATE SAVINGS VALUES
   ========================================================= */

function updateSavingsValues() {

    const goals =
        getSavingsGoals();

    let totalSaved = 0;
    let totalTarget = 0;


    goals.forEach(function (goal) {

        totalSaved +=
            Number(goal.saved || 0);

        totalTarget +=
            Number(goal.target || 0);

    });


    const progress =
        totalTarget > 0
            ? (totalSaved / totalTarget) * 100
            : 0;


    document
        .querySelectorAll(
            '[data-savings="goals"]'
        )
        .forEach(function (element) {

            const value =
                element.querySelector("strong");

            if (value) {
                value.textContent =
                    goals.length;
            } else {
                element.textContent =
                    goals.length;
            }

        });


    document
        .querySelectorAll(
            '[data-savings="saved"]'
        )
        .forEach(function (element) {

            const value =
                element.querySelector("strong");

            if (value) {
                value.textContent =
                    formatNaira(totalSaved);
            } else {
                element.textContent =
                    formatNaira(totalSaved);
            }

        });


    document
        .querySelectorAll(
            '[data-savings="target"]'
        )
        .forEach(function (element) {

            const value =
                element.querySelector("strong");

            if (value) {
                value.textContent =
                    formatNaira(totalTarget);
            } else {
                element.textContent =
                    formatNaira(totalTarget);
            }

        });


    document
        .querySelectorAll(
            '[data-savings="progress"]'
        )
        .forEach(function (element) {

            const value =
                element.querySelector("strong");

            if (value) {
                value.textContent =
                    progress.toFixed(1) + "%";
            } else {
                element.textContent =
                    progress.toFixed(1) + "%";
            }

        });


    document
        .querySelectorAll(
            ".donut-center strong"
        )
        .forEach(function (element) {

            element.textContent =
                progress.toFixed(1) + "%";

        });

}


/* =========================================================
   ADD TRANSACTION
   ========================================================= */

function addNairaPulseTransaction(
    type,
    title,
    category,
    amount,
    date
) {

    const transactions =
        getTransactions();


    transactions.push({

        id: Date.now(),

        type: type,

        title: title,

        description: title,

        category: category,

        amount: Number(amount),

        date:
            date ||
            new Date()
                .toISOString()
                .split("T")[0]

    });


    saveTransactions(
        transactions
    );

    refreshNairaPulse();

}


/* =========================================================
   DELETE TRANSACTION
   ========================================================= */

function deleteNairaPulseTransaction(id) {

    const transactions =
        getTransactions();


    const updated =
        transactions.filter(
            function (transaction) {

                return Number(transaction.id) !==
                    Number(id);

            }
        );


    saveTransactions(
        updated
    );

    refreshNairaPulse();

}


/* =========================================================
   ADD BUDGET
   ========================================================= */

function addNairaPulseBudget(
    category,
    amount,
    period = "monthly"
) {

    const budgets =
        getBudgets();


    budgets.push({

        id: Date.now(),

        category: category,

        amount: Number(amount),

        spent: 0,

        period: period

    });


    saveBudgets(
        budgets
    );

    refreshNairaPulse();

}


/* =========================================================
   UPDATE BUDGET
   ========================================================= */

function updateNairaPulseBudget(
    id,
    amount
) {

    const budgets =
        getBudgets();


    const budget =
        budgets.find(
            function (item) {

                return Number(item.id) ===
                    Number(id);

            }
        );


    if (!budget) {

        console.error(
            "Budget not found:",
            id
        );

        return false;

    }


    budget.amount =
        Number(amount);


    saveBudgets(
        budgets
    );

    refreshNairaPulse();

    return true;

}


/* =========================================================
   UPDATE BUDGET SPENT
   ========================================================= */

function updateNairaPulseBudgetSpent(
    id,
    spent
) {

    const budgets =
        getBudgets();


    const budget =
        budgets.find(
            function (item) {

                return Number(item.id) ===
                    Number(id);

            }
        );


    if (!budget) {

        console.error(
            "Budget not found:",
            id
        );

        return false;

    }


    budget.spent =
        Number(spent);


    saveBudgets(
        budgets
    );

    refreshNairaPulse();

    return true;

}


/* =========================================================
   DELETE BUDGET
   ========================================================= */

function deleteNairaPulseBudget(id) {

    const budgets =
        getBudgets();


    const updated =
        budgets.filter(
            function (budget) {

                return Number(budget.id) !==
                    Number(id);

            }
        );


    saveBudgets(
        updated
    );

    refreshNairaPulse();

}


/* =========================================================
   ADD SAVINGS GOAL
   ========================================================= */

function addNairaPulseGoal(
    name,
    target,
    saved = 0,
    targetDate = ""
) {

    const goals =
        getSavingsGoals();


    goals.push({

        id: Date.now(),

        name: name,

        target: Number(target),

        saved: Number(saved),

        targetDate: targetDate

    });


    saveSavingsGoals(
        goals
    );

    refreshNairaPulse();

}


/* =========================================================
   ADD MONEY TO SAVINGS GOAL
   ========================================================= */

function addMoneyToNairaPulseGoal(
    id,
    amount
) {

    const goals =
        getSavingsGoals();


    const goal =
        goals.find(
            function (item) {

                return Number(item.id) ===
                    Number(id);

            }
        );


    if (!goal) {

        console.error(
            "Savings goal not found:",
            id
        );

        return;

    }


    goal.saved =
        Number(goal.saved || 0) +
        Number(amount || 0);


    if (
        goal.saved >
        Number(goal.target)
    ) {

        goal.saved =
            Number(goal.target);

    }


    saveSavingsGoals(
        goals
    );

    refreshNairaPulse();

}


/* =========================================================
   DELETE SAVINGS GOAL
   ========================================================= */

function deleteNairaPulseGoal(id) {

    const goals =
        getSavingsGoals();


    const updated =
        goals.filter(
            function (goal) {

                return Number(goal.id) !==
                    Number(id);

            }
        );


    saveSavingsGoals(
        updated
    );

    refreshNairaPulse();

}


/* =========================================================
   REFRESH APPLICATION
   ========================================================= */

function refreshNairaPulse() {

    updateDashboardValues();

    updateBudgetValues();

    updateSavingsValues();


    window.dispatchEvent(
        new CustomEvent(
            "nairapulseDataUpdated"
        )
    );

}


/* =========================================================
   LOAD SAVINGS GOALS
   ========================================================= */

function loadSavingsGoalsIntoTable() {

    const tableBody =
        document.querySelector(
            ".goals-panel tbody"
        );


    if (!tableBody) {
        return;
    }


    const goals =
        getSavingsGoals();


    tableBody.innerHTML = "";


    goals.forEach(function (goal) {

        const target =
            Number(goal.target || 0);

        const saved =
            Number(goal.saved || 0);


        let progress =
            target > 0
                ? (saved / target) * 100
                : 0;


        if (progress > 100) {
            progress = 100;
        }


        let status =
            "On Track";

        let statusClass =
            "on-track";


        if (progress >= 100) {

            status =
                "Completed";

            statusClass =
                "completed";

        }


        const row =
            document.createElement("tr");


        row.dataset.goalId =
            goal.id;


        row.innerHTML = `

            <td>

                <div class="goal-name">

                    <span class="goal-icon green">
                        ♢
                    </span>

                    ${escapeHTML(goal.name)}

                </div>

            </td>

            <td>
                ${formatNaira(target)}
            </td>

            <td class="saved">
                ${formatNaira(saved)}
            </td>

            <td>

                <div class="progress-container">

                    <div class="progress-bar">

                        <span
                            class="green-bar"
                            style="width:${progress}%">
                        </span>

                    </div>

                    <span>
                        ${progress.toFixed(0)}%
                    </span>

                </div>

            </td>

            <td>
                ${escapeHTML(goal.targetDate || "")}
            </td>

            <td>

                <span class="status ${statusClass}">
                    ${status}
                </span>

            </td>

            <td>

                <button
                    class="action-btn"
                    type="button"
                    data-goal-id="${goal.id}">
                    ⋮
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });


    window.dispatchEvent(
        new CustomEvent(
            "nairapulseGoalsLoaded"
        )
    );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value == null
            ? ""
            : String(value);

    return div.innerHTML;

}


/* =========================================================
   LOAD TRANSACTIONS
   ========================================================= */

function loadTransactionsIntoTable() {

    const table =
        document.getElementById(
            "transactionTable"
        );


    if (!table) {
        return;
    }


    const transactions =
        getTransactions();


    table.innerHTML = "";


    const sorted =
        [...transactions].sort(
            function (a, b) {

                return Number(b.id || 0) -
                    Number(a.id || 0);

            }
        );


    sorted.forEach(function (transaction) {

        const row =
            document.createElement("tr");


        row.dataset.type =
            transaction.type;

        row.dataset.category =
            transaction.category;


        const title =
            transaction.title ||
            transaction.description ||
            "";


        const firstLetter =
            title
                .charAt(0)
                .toUpperCase();


        const amount =
            Number(transaction.amount || 0);


        const formattedAmount =
            formatNaira(amount);


        const displayAmount =
            transaction.type === "income"
                ? "+" + formattedAmount
                : "-" + formattedAmount;


        const formattedDate =
            transaction.date
                ? new Date(
                    transaction.date +
                    "T00:00:00"
                ).toLocaleDateString(
                    "en-US",
                    {
                        month: "short",
                        day: "2-digit",
                        year: "numeric"
                    }
                )
                : "";


        const categoryClass =
            getTransactionCategoryClass(
                transaction.category
            );


        row.innerHTML = `

            <td>
                ${formattedDate}
            </td>

            <td>

                <div class="description">

                    <div
                        class="transaction-avatar ${categoryClass}">
                        ${escapeHTML(firstLetter)}
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(title)}
                        </strong>

                        <small>
                            Added transaction
                        </small>

                    </div>

                </div>

            </td>

            <td>

                <span
                    class="category ${categoryClass}-category">
                    ${escapeHTML(transaction.category)}
                </span>

            </td>

            <td>

                <span
                    class="type ${transaction.type}-type">

                    ${
                        transaction.type === "income"
                            ? "Income"
                            : "Expense"
                    }

                </span>

            </td>

            <td
                class="amount-cell ${transaction.type}-amount">

                ${displayAmount}

            </td>

            <td>

                <span class="status completed">
                    Completed
                </span>

            </td>

            <td>

                <button
                    class="delete-btn"
                    title="Delete"
                    data-transaction-id="${transaction.id}">
                    ×
                </button>

            </td>

        `;


        table.appendChild(row);

    });


    window.dispatchEvent(
        new CustomEvent(
            "nairapulseTransactionsLoaded"
        )
    );

}


/* =========================================================
   TRANSACTION CATEGORY CLASS
   ========================================================= */

function getTransactionCategoryClass(category) {

    const classes = {

        Food: "food",

        Salary: "salary",

        Income: "salary",

        Transportation: "transport",

        Utilities: "utilities",

        Shopping: "shopping",

        Rent: "salary",

        Entertainment: "salary",

        Other: "salary"

    };


    return (
        classes[category] ||
        "salary"
    );

}


/* =========================================================
   ACTIVE SIDEBAR
   ========================================================= */

function setActiveNairaPulsePage() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    document
        .querySelectorAll(".menu-item")
        .forEach(function (link) {

            const linkPage =
                link.getAttribute("href");


            if (
                linkPage ===
                currentPage
            ) {

                link.classList.add(
                    "active"
                );

            }

        });

}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "NairaPulse app.js loaded"
        );


        initializeNairaPulse();


        loadSavingsGoalsIntoTable();

        loadTransactionsIntoTable();


        refreshNairaPulse();


        setActiveNairaPulsePage();


        console.log(
            "Saved transactions:",
            getTransactions()
        );


        console.log(
            "Saved savings goals:",
            getSavingsGoals()
        );


        console.log(
            "Saved budgets:",
            getBudgets()
        );

    }
);