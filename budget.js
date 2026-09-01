/* =========================================================
   NAIRAPULSE - BUDGET PAGE
   =========================================================
   Budget features:
   - Create Budget
   - Update Budget
   - Update Spent
   - Automatic Remaining calculation
   - Automatic Progress calculation
   - Delete Budget
   - Permanent localStorage saving

   IMPORTANT:
   Spent is entered manually by the user.
   It is NOT taken from Transactions.
   ========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================================
           ELEMENTS
           ===================================================== */

        const modal =
            document.getElementById(
                "budgetModal"
            );

        const openButton =
            document.getElementById(
                "openBudgetModal"
            );

        const closeButton =
            document.getElementById(
                "closeBudgetModal"
            );

        const form =
            document.getElementById(
                "budgetForm"
            );

        const viewActivity =
            document.getElementById(
                "viewActivity"
            );

        const budgetTable =
            document.querySelector(
                ".budget-table"
            );


        /* =====================================================
           SAFETY CHECK
           ===================================================== */

        if (!budgetTable) {

            console.error(
                "Budget table not found."
            );

            return;

        }


        /* =====================================================
           OPEN CREATE BUDGET MODAL
           ===================================================== */

        if (openButton && modal) {

            openButton.addEventListener(
                "click",
                function () {

                    modal.classList.add(
                        "show"
                    );

                }
            );

        }


        /* =====================================================
           CLOSE CREATE BUDGET MODAL
           ===================================================== */

        if (closeButton && modal) {

            closeButton.addEventListener(
                "click",
                function () {

                    modal.classList.remove(
                        "show"
                    );

                }
            );

        }


        /* =====================================================
           CLOSE MODAL OUTSIDE CLICK
           ===================================================== */

        if (modal) {

            modal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target === modal
                    ) {

                        modal.classList.remove(
                            "show"
                        );

                    }

                }
            );

        }


        /* =====================================================
           CATEGORY ICON
           ===================================================== */

        function getCategoryIcon(
            category
        ) {

            const icons = {

                Food: "🍴",

                Rent: "⌂",

                Transportation: "🚗",

                Utilities: "⚡",

                Shopping: "🛍",

                Entertainment: "🎮"

            };


            return (
                icons[category] ||
                "▣"
            );

        }


        /* =====================================================
           CATEGORY CSS CLASS
           ===================================================== */

        function getCategoryClass(
            category
        ) {

            const classes = {

                Food: "food",

                Rent: "rent",

                Transportation: "transport",

                Utilities: "utilities",

                Shopping: "shopping",

                Entertainment: "entertainment"

            };


            return (
                classes[category] ||
                "food"
            );

        }


        /* =====================================================
           FORMAT MONEY
           ===================================================== */

        function formatMoney(
            amount
        ) {

            return "₦" +
                Number(amount || 0)
                    .toLocaleString(
                        "en-NG",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    );

        }


        /* =====================================================
           CALCULATE REMAINING
           ===================================================== */

        function calculateRemaining(
            budget,
            spent
        ) {

            return (
                Number(budget || 0) -
                Number(spent || 0)
            );

        }


        /* =====================================================
           CALCULATE PROGRESS
           ===================================================== */

        function calculateProgress(
            budget,
            spent
        ) {

            budget =
                Number(budget || 0);

            spent =
                Number(spent || 0);


            if (budget <= 0) {

                return 0;

            }


            let percentage =
                (spent / budget) * 100;


            if (percentage < 0) {

                percentage = 0;

            }


            if (percentage > 100) {

                percentage = 100;

            }


            return percentage;

        }


        /* =====================================================
           CREATE BUDGET ROW
           ===================================================== */

        function createBudgetRow(
            budget
        ) {

            const amount =
                Number(
                    budget.amount || 0
                );


            const spent =
                Number(
                    budget.spent || 0
                );


            const remaining =
                calculateRemaining(
                    amount,
                    spent
                );


            const percentage =
                calculateProgress(
                    amount,
                    spent
                );


            const categoryClass =
                getCategoryClass(
                    budget.category
                );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "budget-row";


            row.dataset.id =
                budget.id;


            row.dataset.budget =
                amount;


            row.dataset.spent =
                spent;


            row.innerHTML = `

                <div class="category-name">

                    <span
                        class="category-icon ${categoryClass}">

                        ${getCategoryIcon(
                            budget.category
                        )}

                    </span>

                    ${escapeHTML(
                        budget.category
                    )}

                </div>


                <span>

                    ${formatMoney(
                        amount
                    )}

                </span>


                <span class="spent">

                    ${formatMoney(
                        spent
                    )}

                </span>


                <span class="remaining">

                    ${formatMoney(
                        remaining
                    )}

                </span>


                <div class="progress-area">

                    <div class="progress">

                        <div
                            class="progress-bar ${categoryClass}-bar"
                            style="width:${percentage}%">
                        </div>

                    </div>

                    <span>

                        ${percentage.toFixed(0)}%

                    </span>

                </div>


                <button
                    class="more-btn"
                    type="button">

                    ⋮

                </button>

            `;


            budgetTable.appendChild(
                row
            );


            setupActionButton(
                row
            );

        }


        /* =====================================================
           ESCAPE HTML
           ===================================================== */

        function escapeHTML(
            value
        ) {

            const div =
                document.createElement(
                    "div"
                );


            div.textContent =
                value == null
                    ? ""
                    : String(value);


            return div.innerHTML;

        }


        /* =====================================================
           RENDER BUDGETS
           ===================================================== */

        function renderBudgets() {

            const budgets =
                getBudgets();


            /*
               Remove existing budget rows.
            */

            document
                .querySelectorAll(
                    ".budget-row"
                )
                .forEach(
                    function (row) {

                        row.remove();

                    }
                );


            /*
               Create rows from saved budgets.
            */

            budgets.forEach(
                function (budget) {

                    createBudgetRow(
                        budget
                    );

                }
            );


            updateBudgetSummary();

            updateBudgetOverview();

        }


        /* =====================================================
           CREATE NEW BUDGET
           ===================================================== */

        if (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    const category =
                        document.getElementById(
                            "budgetCategory"
                        ).value;


                    const amount =
                        Number(
                            document.getElementById(
                                "budgetAmount"
                            ).value
                        );


                    const period =
                        document.getElementById(
                            "budgetPeriod"
                        ).value;


                    if (
                        !category ||
                        !amount ||
                        amount <= 0
                    ) {

                        alert(
                            "Please enter a valid budget amount."
                        );

                        return;

                    }


                    const budgets =
                        getBudgets();


                    const existing =
                        budgets.find(
                            function (budget) {

                                return (
                                    budget.category ===
                                    category
                                );

                            }
                        );


                    if (existing) {

                        alert(
                            `${category} already has a budget. ` +
                            `Use the Action button to update it.`
                        );

                        return;

                    }


                    /*
                       Use the new app.js
                       budget storage function.
                    */

                    if (
                        typeof addNairaPulseBudget ===
                        "function"
                    ) {

                        addNairaPulseBudget(
                            category,
                            amount,
                            period
                        );

                    } else {

                        /*
                           Backup storage.
                        */

                        budgets.push({

                            id: Date.now(),

                            category:
                                category,

                            amount:
                                amount,

                            spent: 0,

                            period:
                                period

                        });


                        saveBudgets(
                            budgets
                        );

                    }


                    form.reset();


                    if (modal) {

                        modal.classList.remove(
                            "show"
                        );

                    }


                    renderBudgets();


                    alert(
                        `${category} budget created successfully!`
                    );

                }
            );

        }


        /* =====================================================
           ACTION BUTTON
           ===================================================== */

        function setupActionButton(
            row
        ) {

            const button =
                row.querySelector(
                    ".more-btn"
                );


            if (!button) {
                return;
            }


            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(
                            row.dataset.id
                        );


                    const budgets =
                        getBudgets();


                    const budget =
                        budgets.find(
                            function (item) {

                                return (
                                    Number(item.id) ===
                                    id
                                );

                            }
                        );


                    if (!budget) {

                        alert(
                            "Budget could not be found."
                        );

                        return;

                    }


                    const choice =
                        prompt(

                            `Budget options for ${budget.category}\n\n` +

                            `1. Update Budget\n` +

                            `2. Update Spent\n` +

                            `3. Delete Budget\n\n` +

                            `Enter 1, 2 or 3:`

                        );


                    /* =========================================
                       UPDATE BUDGET
                       ========================================= */

                    if (choice === "1") {

                        const newAmount =
                            prompt(

                                `Enter new budget amount for ${budget.category}:`,

                                budget.amount

                            );


                        if (
                            newAmount === null
                        ) {

                            return;

                        }


                        if (
                            newAmount.trim() === ""
                        ) {

                            return;

                        }


                        const amount =
                            Number(
                                newAmount
                            );


                        if (
                            isNaN(amount) ||
                            amount <= 0
                        ) {

                            alert(
                                "Please enter a valid budget amount."
                            );

                            return;

                        }


                        /*
                           Do not allow a budget
                           smaller than the amount
                           already spent.
                        */

                        if (
                            amount <
                            Number(
                                budget.spent || 0
                            )
                        ) {

                            alert(

                                `Your current spent amount is ${formatMoney(
                                    budget.spent
                                )}.\n\n` +

                                `The new budget cannot be less than the amount already spent.`

                            );

                            return;

                        }


                        if (
                            typeof updateNairaPulseBudget ===
                            "function"
                        ) {

                            updateNairaPulseBudget(
                                id,
                                amount
                            );

                        } else {

                            budget.amount =
                                amount;

                            saveBudgets(
                                budgets
                            );

                        }


                        renderBudgets();


                        alert(
                            `${budget.category} budget updated successfully!`
                        );

                    }


                    /* =========================================
                       UPDATE SPENT
                       ========================================= */

                    else if (
                        choice === "2"
                    ) {

                        const newSpent =
                            prompt(

                                `How much have you spent from your ${budget.category} budget?\n\n` +

                                `Budget: ${formatMoney(
                                    budget.amount
                                )}\n` +

                                `Current spent: ${formatMoney(
                                    budget.spent
                                )}\n\n` +

                                `Enter total amount spent:`,

                                budget.spent || 0

                            );


                        if (
                            newSpent === null
                        ) {

                            return;

                        }


                        if (
                            newSpent.trim() === ""
                        ) {

                            return;

                        }


                        const spent =
                            Number(
                                newSpent
                            );


                        if (
                            isNaN(spent) ||
                            spent < 0
                        ) {

                            alert(
                                "Please enter a valid spent amount."
                            );

                            return;

                        }


                        if (
                            spent >
                            Number(
                                budget.amount
                            )
                        ) {

                            const continueAnyway =
                                confirm(

                                    `You entered ${formatMoney(
                                        spent
                                    )}, but your budget is only ${formatMoney(
                                        budget.amount
                                    )}.\n\n` +

                                    `This will put the budget over its limit.\n\n` +

                                    `Do you want to continue?`

                                );


                            if (
                                !continueAnyway
                            ) {

                                return;

                            }

                        }


                        /*
                           SAVE SPENT AMOUNT
                        */

                        if (
                            typeof updateNairaPulseBudgetSpent ===
                            "function"
                        ) {

                            updateNairaPulseBudgetSpent(
                                id,
                                spent
                            );

                        } else {

                            budget.spent =
                                spent;

                            saveBudgets(
                                budgets
                            );

                        }


                        /*
                           Re-render everything.
                           Remaining and progress are
                           calculated automatically.
                        */

                        renderBudgets();


                        const remaining =
                            calculateRemaining(
                                budget.amount,
                                spent
                            );


                        const progress =
                            calculateProgress(
                                budget.amount,
                                spent
                            );


                        alert(

                            `${budget.category} updated successfully!\n\n` +

                            `Budget: ${formatMoney(
                                budget.amount
                            )}\n` +

                            `Spent: ${formatMoney(
                                spent
                            )}\n` +

                            `Remaining: ${formatMoney(
                                remaining
                            )}\n` +

                            `Progress: ${progress.toFixed(
                                1
                            )}%`
                        );
                    }

                    /* =========================================
                       DELETE BUDGET
                       ========================================= */

                    else if (
                        choice === "3"
                    ) {
                        const confirmDelete =
                            confirm(
                                `Are you sure you want to delete the ${budget.category} budget?`
                            );

                        if (
                            !confirmDelete
                        ) {
                            return;
                        }

                        if (
                            typeof deleteNairaPulseBudget ===
                            "function"
                        ) {
                            deleteNairaPulseBudget(
                                id
                            );

                        } else {
                            const updatedBudgets =
                                budgets.filter(
                                    function (item) {

                                        return (
                                            Number(item.id) !==
                                            id
                                        );
                                    }
                                );

                            saveBudgets(
                                updatedBudgets
                            );
                        }

                        renderBudgets();

                        alert(
                            `${budget.category} budget deleted successfully!`
                        );
                    }
                }
            );
        }

        /* =====================================================
           UPDATE SUMMARY CARDS
           ===================================================== */

        function updateBudgetSummary() {

            const budgets =
                getBudgets();

            let totalBudget = 0;

            let totalSpent = 0;

            budgets.forEach(
                function (budget) {

                    totalBudget +=
                        Number(
                            budget.amount || 0
                        );

                    totalSpent +=
                        Number(
                            budget.spent || 0
                        );
                }
            );

            const remaining =
                totalBudget -
                totalSpent;

            const usage =
                totalBudget > 0
                    ? (
                        totalSpent /
                        totalBudget
                    ) * 100
                    : 0;

            /* ================================================
               TOTAL BUDGET
               ================================================ */

            document
                .querySelectorAll(
                    '[data-budget="total"]'
                )
                .forEach(
                    function (element) {

                        element.textContent =
                            formatMoney(
                                totalBudget
                            );
                    }
                );


            /* ================================================
               TOTAL SPENT
               ================================================ */

            document
                .querySelectorAll(
                    '[data-budget="spent"]'
                )
                .forEach(
                    function (element) {

                        element.textContent =
                            formatMoney(
                                totalSpent
                            );
                    }
                );

            /* ================================================
               REMAINING
               ================================================ */

            document
                .querySelectorAll(
                    '[data-budget="remaining"]'
                )
                .forEach(
                    function (element) {

                        element.textContent =
                            formatMoney(
                                remaining
                            );
                    }
                );

            /* ================================================
               USAGE
               ================================================ */

            document
                .querySelectorAll(
                    '[data-budget="usage"]'
                )
                .forEach(
                    function (element) {

                        element.textContent =
                            usage.toFixed(1) +
                            "%";
                    }
                );

            /* ================================================
               FOURTH SUMMARY CARD
               ================================================ */

            const summaryCards =
                document.querySelectorAll(
                    ".summary-card"
                );

            if (
                summaryCards.length >= 4
            ) {
                const usageElement =
                    summaryCards[3]
                        .querySelector(
                            "h3"
                        );

                const usageSmall =
                    summaryCards[3]
                        .querySelector(
                            "small"
                        );

                if (usageElement) {

                    usageElement.textContent =
                        usage.toFixed(1) +
                        "%";
                }

                if (usageSmall) {

                    usageSmall.textContent =
                        "Across all categories";
                }
            }

            /* ================================================
               CATEGORY COUNT
               ================================================ */

            if (
                summaryCards.length >= 1
            ) {
                const small =
                    summaryCards[0]
                        .querySelector(
                            "small"
                        );

                if (small) {
                    small.textContent =
                        `Across ${budgets.length} categories`;
                }
            }

            /* ================================================
               REMAINING PERCENTAGE
               ================================================ */

            if (
                summaryCards.length >= 3
            ) {

                const small =
                    summaryCards[2]
                        .querySelector(
                            "small"
                        );

                if (small) {

                    const remainingPercentage =
                        totalBudget > 0
                            ? (
                                remaining /
                                totalBudget
                            ) * 100
                            : 0;

                    small.textContent =
                        `${remainingPercentage.toFixed(
                            1
                        )}% of budget left`;
                }
            }
        }

        /* =====================================================
           UPDATE BUDGET OVERVIEW
           ===================================================== */

        function updateBudgetOverview() {

            const budgets =
                getBudgets();

            let total =
                0;

            budgets.forEach(
                function (budget) {

                    total +=
                        Number(
                            budget.amount || 0
                        );
                }
            );

            const donutCenter =
                document.querySelector(
                    ".donut-center strong"
                );

            if (donutCenter) {

                donutCenter.textContent =
                    formatMoney(
                        total
                    ).replace(
                        ".00",
                        ""
                    );
            }

            const legend =
                document.querySelector(
                    ".legend"
                );

            if (!legend) {
                return;
            }

            legend.innerHTML = "";

            budgets.forEach(
                function (budget) {

                    const categoryClass =
                        getCategoryClass(
                            budget.category
                        );

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.className =
                        "legend-item";

                    item.innerHTML = `

                        <span
                            class="dot ${categoryClass}">
                        </span>

                        <span>
                            ${escapeHTML(
                                budget.category
                            )}
                        </span>

                        <strong>
                            ${formatMoney(
                                budget.amount
                            )}
                        </strong>
                    `;

                    legend.appendChild(
                        item
                    );
                }
            );
        }

        /* =====================================================
           VIEW ACTIVITY
           ===================================================== */

        if (viewActivity) {
            viewActivity.addEventListener(
                "click",
                function () {
                    alert(
                        "Budget activity is calculated from your saved budget information."
                    );
                }
            );
        }

        /* =====================================================
           REFRESH WHEN DATA CHANGES
           ===================================================== */

        window.addEventListener(
            "nairapulseDataUpdated",
            function () {
                renderBudgets();
            }
        );

        renderBudgets();
    }
);