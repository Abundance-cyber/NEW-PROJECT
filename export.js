/* =========================================================
   NAIRAPULSE - EXPORT DATA
   READS DATA FROM app.js / LOCAL STORAGE
   ========================================================= */


/* =========================================================
   GET NAIRAPULSE DATA
   ========================================================= */

function getExportTransactions() {

    if (typeof getTransactions === "function") {
        return getTransactions();
    }

    return [];
}


function getExportBudgets() {

    if (typeof getBudgets === "function") {
        return getBudgets();
    }

    return [];
}


function getExportSavingsGoals() {

    if (typeof getSavingsGoals === "function") {
        return getSavingsGoals();
    }

    return [];
}


/* =========================================================
   UPDATE EXPORT SUMMARY CARDS
   ========================================================= */

function updateExportSummary() {

    const transactions = getExportTransactions();
    const budgets = getExportBudgets();
    const savingsGoals = getExportSavingsGoals();


    /* -----------------------------------------
       TOTAL RECORDS
       ----------------------------------------- */

    const totalRecords = transactions.length;


    /* -----------------------------------------
       CATEGORIES
       ----------------------------------------- */

    const categories = new Set();

    transactions.forEach(function (transaction) {

        if (transaction.category) {

            categories.add(
                transaction.category
            );

        }

    });


    const categoryCount = categories.size;


    /* -----------------------------------------
       BUDGETS
       ----------------------------------------- */

    const budgetCount = budgets.length;


    /* -----------------------------------------
       SAVINGS GOALS
       ----------------------------------------- */

    const savingsGoalCount =
        savingsGoals.length;


    /* -----------------------------------------
       UPDATE CARDS
       ----------------------------------------- */

    const summaryCards =
        document.querySelectorAll(
            ".summary-card"
        );


    if (summaryCards.length >= 5) {

        /* Total Records */

        const totalRecordsValue =
            summaryCards[0].querySelector(
                "strong"
            );

        if (totalRecordsValue) {

            totalRecordsValue.textContent =
                totalRecords.toLocaleString();

        }


        /* Categories */

        const categoriesValue =
            summaryCards[1].querySelector(
                "strong"
            );

        if (categoriesValue) {

            categoriesValue.textContent =
                categoryCount.toLocaleString();

        }


        /* Budgets */

        const budgetsValue =
            summaryCards[2].querySelector(
                "strong"
            );

        if (budgetsValue) {

            budgetsValue.textContent =
                budgetCount.toLocaleString();

        }


        /* Savings Goals */

        const savingsValue =
            summaryCards[3].querySelector(
                "strong"
            );

        if (savingsValue) {

            savingsValue.textContent =
                savingsGoalCount.toLocaleString();

        }

    }


    /* =====================================================
       UPDATE EXPORT SUMMARY TEXT
       ===================================================== */

    const summaryItems =
        document.querySelectorAll(
            ".included-item"
        );


    if (summaryItems.length >= 5) {

        /* Transactions */

        const transactionSmall =
            summaryItems[1].querySelector(
                "small"
            );

        if (transactionSmall) {

            transactionSmall.textContent =
                transactions.length.toLocaleString()
                + " total records";

        }


        /* Budgets */

        const budgetSmall =
            summaryItems[2].querySelector(
                "small"
            );

        if (budgetSmall) {

            budgetSmall.textContent =
                budgetCount.toLocaleString()
                + " budgets, "
                + categoryCount.toLocaleString()
                + " categories";

        }


        /* Savings Goals */

        const savingsSmall =
            summaryItems[4].querySelector(
                "small"
            );

        if (savingsSmall) {

            savingsSmall.textContent =
                savingsGoalCount.toLocaleString()
                + " goals and contributions";

        }

    }


    console.log(
        "NairaPulse Export Data:",
        {
            transactions: transactions,
            budgets: budgets,
            savingsGoals: savingsGoals,
            totalRecords: totalRecords,
            categories: categoryCount,
            budgetCount: budgetCount,
            savingsGoalCount: savingsGoalCount
        }
    );

}


/* =========================================================
   SELECT ALL
   ========================================================= */

const selectAllBtn =
    document.getElementById(
        "selectAllBtn"
    );


const moduleCheckboxes =
    document.querySelectorAll(
        ".module-checkbox"
    );


let allSelected = true;


if (selectAllBtn) {

    selectAllBtn.addEventListener(
        "click",
        function () {

            allSelected = !allSelected;


            moduleCheckboxes.forEach(
                function (checkbox) {

                    checkbox.checked =
                        allSelected;

                }
            );


            if (allSelected) {

                selectAllBtn.innerHTML =
                    "□ &nbsp; Unselect All";

            } else {

                selectAllBtn.innerHTML =
                    "□ &nbsp; Select All";

            }

        }
    );

}


/* =========================================================
   UPDATE SELECT ALL
   ========================================================= */

moduleCheckboxes.forEach(
    function (checkbox) {

        checkbox.addEventListener(
            "change",
            function () {

                const checkedCount =
                    document.querySelectorAll(
                        ".module-checkbox:checked"
                    ).length;


                if (
                    checkedCount ===
                    moduleCheckboxes.length
                ) {

                    selectAllBtn.innerHTML =
                        "□ &nbsp; Unselect All";

                    allSelected = true;

                } else {

                    selectAllBtn.innerHTML =
                        "□ &nbsp; Select All";

                    allSelected = false;

                }

            }
        );

    }
);


/* =========================================================
   GET SELECTED MODULES
   ========================================================= */

function getSelectedModules() {

    const selected = [];


    moduleCheckboxes.forEach(
        function (checkbox) {

            if (checkbox.checked) {

                selected.push(
                    checkbox.value
                );

            }

        }
    );


    return selected;

}


/* =========================================================
   GET DATE RANGE
   ========================================================= */

function getSelectedDateRange() {

    const selected =
        document.querySelector(
            'input[name="dateRange"]:checked'
        );


    if (selected) {

        return selected.value;

    }


    return "This Month";

}


/* =========================================================
   GET FORMAT
   ========================================================= */

function getSelectedFormat() {

    const selected =
        document.querySelector(
            'input[name="format"]:checked'
        );


    if (selected) {

        return selected.value;

    }


    return "XLSX";

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    const oldToast =
        document.querySelector(
            ".toast"
        );


    if (oldToast) {

        oldToast.remove();

    }


    const toast =
        document.createElement("div");


    toast.className =
        "toast";


    toast.textContent =
        message;


    document.body.appendChild(
        toast
    );


    setTimeout(
        function () {

            toast.remove();

        },
        3000
    );

}


/* =========================================================
   EXPORT BUTTON
   ========================================================= */

const exportAllBtn =
    document.getElementById(
        "exportAllBtn"
    );


if (exportAllBtn) {

    exportAllBtn.addEventListener(
        "click",
        function () {

            const modules =
                getSelectedModules();


            const dateRange =
                getSelectedDateRange();


            const format =
                getSelectedFormat();


            if (modules.length === 0) {

                showToast(
                    "Please select at least one module."
                );

                return;

            }


            exportAllBtn.disabled =
                true;


            exportAllBtn.textContent =
                "Preparing Export...";


            setTimeout(
                function () {

                    exportAllBtn.disabled =
                        false;


                    exportAllBtn.innerHTML =
                        "⇩ &nbsp; Export All Now";


                    showToast(
                        "Export prepared successfully: "
                        + format
                        + " • "
                        + dateRange
                    );


                    addNewExport(
                        modules,
                        dateRange,
                        format
                    );

                },
                1200
            );

        }
    );

}


/* =========================================================
   ADD EXPORT TO TABLE
   ========================================================= */

function addNewExport(
    modules,
    dateRange,
    format
) {

    const table =
        document.getElementById(
            "exportTable"
        );


    if (!table) {
        return;
    }


    const row =
        document.createElement("tr");


    const date =
        new Date();


    const dateString =
        date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );


    const timeString =
        date.toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    let fileName =
        "nairapulse_all_data_"
        + format.toLowerCase()
        + "."
        + format.toLowerCase();


    let tagClass =
        "green-tag";


    if (modules.length === 1) {

        const module =
            modules[0];


        fileName =
            module
                .toLowerCase()
                .replace(/\s+/g, "_")
            + "_export."
            + format.toLowerCase();

    }


    if (
        modules.includes(
            "Transactions"
        )
    ) {

        tagClass =
            "blue-tag";

    }


    if (
        modules.includes(
            "Budgets"
        )
    ) {

        tagClass =
            "orange-tag";

    }


    if (
        modules.includes(
            "Reports"
        )
    ) {

        tagClass =
            "purple-tag";

    }


    if (
        modules.includes(
            "Savings Goals"
        )
    ) {

        tagClass =
            "teal-tag";

    }


    const transactions =
        getExportTransactions();


    row.innerHTML = `

        <td>
            📄 ${fileName}
        </td>

        <td>
            <span class="tag ${tagClass}">
                ${
                    modules.length === 5
                        ? "All Modules"
                        : modules.join(", ")
                }
            </span>
        </td>

        <td>
            ${dateRange}
        </td>

        <td>
            <span class="tag ${format.toLowerCase()}">
                ${format}
            </span>
        </td>

        <td>
            ${transactions.length} records
        </td>

        <td>
            ${dateString} ${timeString}
        </td>

        <td>
            <span class="status">
                Completed
            </span>
        </td>

        <td class="actions">

            <button class="download-btn">
                ⇩
            </button>

            <button class="delete-btn">
                🗑
            </button>

        </td>

    `;


    table.insertBefore(
        row,
        table.firstElementChild
    );


    attachRowButtons(row);

}


/* =========================================================
   DOWNLOAD
   ========================================================= */

function downloadExport(button) {

    showToast(
        "Preparing your file..."
    );


    setTimeout(
        function () {

            showToast(
                "Download started."
            );

        },
        1000
    );

}


/* =========================================================
   DELETE
   ========================================================= */

function deleteExport(button) {

    const row =
        button.closest("tr");


    if (!row) {
        return;
    }


    const confirmDelete =
        confirm(
            "Delete this export from the list?"
        );


    if (confirmDelete) {

        row.remove();


        showToast(
            "Export removed."
        );

    }

}


/* =========================================================
   ATTACH ROW BUTTONS
   ========================================================= */

function attachRowButtons(row) {

    const downloadButton =
        row.querySelector(
            ".download-btn"
        );


    const deleteButton =
        row.querySelector(
            ".delete-btn"
        );


    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            function () {

                downloadExport(
                    downloadButton
                );

            }
        );

    }


    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            function () {

                deleteExport(
                    deleteButton
                );

            }
        );

    }

}


/* =========================================================
   EXISTING ROW BUTTONS
   ========================================================= */

document
    .querySelectorAll(
        "#exportTable tr"
    )
    .forEach(
        function (row) {

            attachRowButtons(row);

        }
    );


/* =========================================================
   VIEW ALL
   ========================================================= */

const viewAllBtn =
    document.getElementById(
        "viewAllBtn"
    );


if (viewAllBtn) {

    viewAllBtn.addEventListener(
        "click",
        function () {

            showToast(
                "Showing all available exports."
            );

        }
    );

}


/* =========================================================
   MONTH SELECT
   ========================================================= */

const monthSelect =
    document.getElementById(
        "monthSelect"
    );


if (monthSelect) {

    monthSelect.addEventListener(
        "change",
        function () {

            showToast(
                "Date filter changed to "
                + monthSelect.value
            );

        }
    );

}


/* =========================================================
   IMPORTANT:
   LOAD REAL DATA FROM app.js
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateExportSummary();

    }
);


/* =========================================================
   ALSO UPDATE WHEN app.js CHANGES DATA
   ========================================================= */

window.addEventListener(
    "nairapulseDataUpdated",
    function () {

        updateExportSummary();

    }
);