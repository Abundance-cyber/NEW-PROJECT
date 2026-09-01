// ==========================================
// NAIRAPULSE - TRANSACTIONS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ======================================
    // ELEMENTS
    // ======================================

    const modal = document.getElementById("modal");
    const openModal = document.getElementById("openModal");
    const closeModal = document.getElementById("closeModal");
    const form = document.getElementById("transactionForm");

    const table = document.getElementById("transactionTable");

    const searchInput = document.getElementById("searchInput");
    const typeFilter = document.getElementById("typeFilter");
    const categoryFilter = document.getElementById("categoryFilter");

    const noResults = document.getElementById("noResults");
    const transactionCount =
        document.getElementById("transactionCount");

    const transactionType =
        document.getElementById("transactionType");

    const typeButtons =
        document.querySelectorAll(".type-button");

    // ======================================
    // OPEN MODAL
    // ======================================

    openModal.addEventListener("click", function () {
        modal.classList.add("show");
    });

    // ======================================
    // CLOSE MODAL
    // ======================================

    closeModal.addEventListener("click", function () {
        modal.classList.remove("show");
    });

    // ======================================
    // CLOSE WHEN CLICKING OUTSIDE
    // ======================================

    modal.addEventListener("click", function (event) {

        if (event.target === modal) {
            modal.classList.remove("show");
        }

    });

    // ======================================
    // TRANSACTION TYPE
    // ======================================

    typeButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            typeButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            this.classList.add("active");

            transactionType.value =
                this.dataset.value;

        });

    });

    // ======================================
    // ADD TRANSACTION
    // ======================================

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        // Get values
        const description =
            document.getElementById("description").value.trim();

        const amount =
            parseFloat(
                document.getElementById("amount").value
            );

        const category =
            document.getElementById("category").value;

        const date =
            document.getElementById("date").value;

        const type =
            transactionType.value;

        // Check values
        if (
            !description ||
            !amount ||
            amount <= 0 ||
            !category ||
            !date
        ) {
            alert("Please fill in all transaction details.");
            return;
        }

        // ==================================
        // FORMAT DATE
        // ==================================

        const formattedDate =
            new Date(date + "T00:00:00")
                .toLocaleDateString(
                    "en-US",
                    {
                        month: "short",
                        day: "2-digit",
                        year: "numeric"
                    }
                );

        // ==================================
        // FIRST LETTER
        // ==================================

        const firstLetter =
            description.charAt(0).toUpperCase();

        // ==================================
        // FORMAT AMOUNT
        // ==================================

        const formattedAmount =
            "₦" +
            amount.toLocaleString(
                "en-NG",
                {
                    minimumFractionDigits: 2
                }
            );

        const displayAmount =
            type === "income"
                ? "+" + formattedAmount
                : "-" + formattedAmount;

        // ==================================
        // CREATE TRANSACTION ROW
        // ==================================

        const row =
            document.createElement("tr");

        row.dataset.type = type;
        row.dataset.category = category;

        row.innerHTML = `
            <td>
                ${formattedDate}
            </td>

            <td>
                <div class="description">

                    <div class="transaction-avatar ${getCategoryClass(category)}">
                        ${firstLetter}
                    </div>

                    <div>
                        <strong>
                            ${description}
                        </strong>

                        <small>
                            Added transaction
                        </small>
                    </div>

                </div>
            </td>

            <td>
                <span class="category ${getCategoryClass(category)}-category">
                    ${category}
                </span>
            </td>

            <td>
                <span class="type ${type}-type">
                    ${type === "income" ? "Income" : "Expense"}
                </span>
            </td>

            <td class="amount-cell ${type}-amount">
                ${displayAmount}
            </td>

            <td>
                <span class="status completed">
                    Completed
                </span>
            </td>

            <td>
                <button class="delete-btn" title="Delete">
                    ×
                </button>
            </td>
        `;

        // Put newest transaction at top
        table.prepend(row);

        // Add delete button
        addDeleteFunction(row);

        // ==================================
        // SAVE TO LOCAL STORAGE
        // ==================================

        saveTransaction({
            id: Date.now(),
            description: description,
            amount: amount,
            category: category,
            date: date,
            type: type
        });

        // ==================================
        // RESET FORM
        // ==================================

        form.reset();

        transactionType.value = "income";

        typeButtons.forEach(function (button) {
            button.classList.remove("active");
        });

        if (typeButtons[0]) {
            typeButtons[0].classList.add("active");
        }

        // Close modal
        modal.classList.remove("show");

        // Update screen
        updateSummary();
        updateCount();
        filterTransactions();

    });

    // ======================================
    // CATEGORY CLASS
    // ======================================

    function getCategoryClass(category) {

        const classes = {

            Food: "food",

            Salary: "salary",

            Transportation: "transport",

            Utilities: "utilities",

            Shopping: "shopping",

            Rent: "salary",

            Other: "salary"

        };

        return classes[category] || "salary";

    }

    // ======================================
    // SAVE TRANSACTION
    // ======================================

    function saveTransaction(transaction) {

        let transactions =
            JSON.parse(
                localStorage.getItem("nairapulseTransactions")
            ) || [];

        transactions.push(transaction);

        localStorage.setItem(
            "nairapulseTransactions",
            JSON.stringify(transactions)
        );

    }

    // ======================================
    // DELETE TRANSACTION
    // ======================================

    function addDeleteFunction(row) {

        const deleteButton =
            row.querySelector(".delete-btn");

        deleteButton.addEventListener(
            "click",
            function () {

                const description =
                    row.querySelector("strong").textContent.trim();

                const amountText =
                    row.querySelector(".amount-cell").textContent;

                // Remove from localStorage
                let transactions =
                    JSON.parse(
                        localStorage.getItem(
                            "nairapulseTransactions"
                        )
                    ) || [];

                transactions =
                    transactions.filter(function (transaction) {

                        const formatted =
                            "₦" +
                            transaction.amount.toLocaleString(
                                "en-NG",
                                {
                                    minimumFractionDigits: 2
                                }
                            );

                        return !(
                            transaction.description === description &&
                            amountText.includes(formatted)
                        );

                    });

                localStorage.setItem(
                    "nairapulseTransactions",
                    JSON.stringify(transactions)
                );

                // Remove from screen
                row.remove();

                updateSummary();
                updateCount();
                filterTransactions();

            }
        );

    }

    // ======================================
    // EXISTING DELETE BUTTONS
    // ======================================

    document
        .querySelectorAll(".delete-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    this.closest("tr").remove();

                    updateCount();
                    filterTransactions();

                }
            );

        });

    // ======================================
    // SEARCH
    // ======================================

    searchInput.addEventListener(
        "input",
        filterTransactions
    );

    typeFilter.addEventListener(
        "change",
        filterTransactions
    );

    categoryFilter.addEventListener(
        "change",
        filterTransactions
    );

    // ======================================
    // FILTER
    // ======================================

    function filterTransactions() {

        const search =
            searchInput.value
                .toLowerCase()
                .trim();

        const selectedType =
            typeFilter.value;

        const selectedCategory =
            categoryFilter.value;

        const rows =
            table.querySelectorAll("tr");

        let visibleCount = 0;

        rows.forEach(function (row) {

            const text =
                row.textContent.toLowerCase();

            const type =
                row.dataset.type;

            const category =
                row.dataset.category;

            const matchesSearch =
                text.includes(search);

            const matchesType =
                selectedType === "all" ||
                type === selectedType;

            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;

            if (
                matchesSearch &&
                matchesType &&
                matchesCategory
            ) {

                row.style.display = "";
                visibleCount++;

            } else {

                row.style.display = "none";

            }

        });

        if (visibleCount === 0) {

            noResults.style.display = "block";

        } else {

            noResults.style.display = "none";

        }

        transactionCount.textContent =
            visibleCount;

    }

    // ======================================
    // UPDATE COUNT
    // ======================================

    function updateCount() {

        const rows =
            table.querySelectorAll("tr");

        transactionCount.textContent =
            rows.length;

    }

    // ======================================
    // UPDATE SUMMARY
    // ======================================

    function updateSummary() {

        let income = 0;
        let expenses = 0;

        const rows =
            table.querySelectorAll("tr");

        rows.forEach(function (row) {

            const amountElement =
                row.querySelector(".amount-cell");

            if (!amountElement) return;

            const amount =
                parseFloat(
                    amountElement.textContent
                        .replace(/[₦,+-]/g, "")
                        .replace(/,/g, "")
                );

            if (
                row.dataset.type === "income"
            ) {

                income += amount;

            } else {

                expenses += amount;

            }

        });

        const balance =
            income - expenses;

        document.getElementById(
            "totalIncome"
        ).textContent =
            "₦" +
            income.toLocaleString(
                "en-NG",
                {
                    minimumFractionDigits: 2
                }
            );

        document.getElementById(
            "totalExpenses"
        ).textContent =
            "₦" +
            expenses.toLocaleString(
                "en-NG",
                {
                    minimumFractionDigits: 2
                }
            );

        document.getElementById(
            "currentBalance"
        ).textContent =
            "₦" +
            balance.toLocaleString(
                "en-NG",
                {
                    minimumFractionDigits: 2
                }
            );

    }

    // ======================================
    // DEFAULT DATE
    // ======================================

    const dateInput =
        document.getElementById("date");

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    dateInput.value = today;

    // ======================================
    // START
    // ======================================

    updateCount();
    updateSummary();
    filterTransactions();

});