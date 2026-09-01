/* =========================================================
   NAIRAPULSE - REPORTS PAGE
   =========================================================
   This page reads directly from the same localStorage
   used by app.js.

   It does NOT create separate report data.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       STORAGE KEYS
    ===================================================== */

    const TRANSACTIONS_KEY = "nairapulseTransactions";
    const BUDGETS_KEY = "nairapulseBudgets";
    const GOALS_KEY = "nairapulseGoals";


    /* =====================================================
       MONTHS
    ===================================================== */

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];


    /* =====================================================
       GET DATA FROM NAIRAPULSE STORAGE
    ===================================================== */

    function getTransactions() {

        try {

            const data =
                JSON.parse(
                    localStorage.getItem(
                        TRANSACTIONS_KEY
                    )
                );

            return Array.isArray(data)
                ? data
                : [];

        } catch (error) {

            console.error(
                "Could not load transactions:",
                error
            );

            return [];

        }

    }


    function getBudgets() {

        try {

            const data =
                JSON.parse(
                    localStorage.getItem(
                        BUDGETS_KEY
                    )
                );

            return Array.isArray(data)
                ? data
                : [];

        } catch (error) {

            console.error(
                "Could not load budgets:",
                error
            );

            return [];

        }

    }


    function getSavingsGoals() {

        try {

            const data =
                JSON.parse(
                    localStorage.getItem(
                        GOALS_KEY
                    )
                );

            return Array.isArray(data)
                ? data
                : [];

        } catch (error) {

            console.error(
                "Could not load savings goals:",
                error
            );

            return [];

        }

    }


    /* =====================================================
       FORMAT NAIRA
    ===================================================== */

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


    /* =====================================================
       GET CURRENT MONTH
    ===================================================== */

    const today =
        new Date();

    let selectedMonth =
        today.getMonth();

    let selectedYear =
        today.getFullYear();


    /* =====================================================
       MONTH SELECTOR
    ===================================================== */

    const monthButton =
        document.querySelector(".month-btn");


    function createMonthSelector() {

        if (!monthButton) {
            return;
        }


        monthButton.innerHTML = `
            <span>▣</span>
            <span class="selected-month">
                ${months[selectedMonth]}
            </span>
            <span>⌄</span>
        `;


        monthButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                let existing =
                    document.querySelector(
                        ".month-dropdown"
                    );


                if (existing) {

                    existing.remove();

                    return;

                }


                const dropdown =
                    document.createElement("div");

                dropdown.className =
                    "month-dropdown";


                months.forEach(
                    function (month, index) {

                        const option =
                            document.createElement("button");

                        option.type = "button";

                        option.textContent =
                            month;


                        if (
                            index ===
                            selectedMonth
                        ) {

                            option.classList.add(
                                "selected"
                            );

                        }


                        option.addEventListener(
                            "click",
                            function () {

                                selectedMonth =
                                    index;

                                document
                                    .querySelector(
                                        ".selected-month"
                                    )
                                    .textContent =
                                    month;

                                dropdown.remove();

                                updateReport();

                            }
                        );


                        dropdown.appendChild(
                            option
                        );

                    }
                );


                document.body.appendChild(
                    dropdown
                );


                const rect =
                    monthButton.getBoundingClientRect();


                dropdown.style.top =
                    (
                        rect.bottom +
                        window.scrollY +
                        5
                    ) + "px";


                dropdown.style.left =
                    (
                        rect.left +
                        window.scrollX
                    ) + "px";

            }
        );

    }


    /* =====================================================
       CLOSE MONTH DROPDOWN
    ===================================================== */

    document.addEventListener(
        "click",
        function () {

            const dropdown =
                document.querySelector(
                    ".month-dropdown"
                );

            if (dropdown) {

                dropdown.remove();

            }

        }
    );


    /* =====================================================
       GET MONTH TRANSACTIONS
    ===================================================== */

    function getMonthTransactions() {

        const transactions =
            getTransactions();


        return transactions.filter(
            function (transaction) {

                if (!transaction.date) {

                    return false;

                }


                const date =
                    new Date(
                        transaction.date +
                        "T00:00:00"
                    );


                return (
                    date.getMonth() ===
                    selectedMonth &&
                    date.getFullYear() ===
                    selectedYear
                );

            }
        );

    }


    /* =====================================================
       TOTAL INCOME
    ===================================================== */

    function getMonthIncome() {

        return getMonthTransactions()

            .filter(
                transaction =>
                    transaction.type ===
                    "income"
            )

            .reduce(
                function (
                    total,
                    transaction
                ) {

                    return total +
                        Number(
                            transaction.amount || 0
                        );

                },
                0
            );

    }


    /* =====================================================
       TOTAL EXPENSES
    ===================================================== */

    function getMonthExpenses() {

        return getMonthTransactions()

            .filter(
                transaction =>
                    transaction.type ===
                    "expense"
            )

            .reduce(
                function (
                    total,
                    transaction
                ) {

                    return total +
                        Number(
                            transaction.amount || 0
                        );

                },
                0
            );

    }


    /* =====================================================
       NET SAVINGS
    ===================================================== */

    function getNetSavings() {

        return (
            getMonthIncome() -
            getMonthExpenses()
        );

    }


    /* =====================================================
       SAVINGS RATE
    ===================================================== */

    function getSavingsRate() {

        const income =
            getMonthIncome();


        if (income <= 0) {

            return 0;

        }


        return (
            getNetSavings() /
            income
        ) * 100;

    }


    /* =====================================================
       UPDATE SUMMARY CARDS
    ===================================================== */

    function updateSummaryCards() {

        const income =
            getMonthIncome();

        const expenses =
            getMonthExpenses();

        const savings =
            getNetSavings();

        const rate =
            getSavingsRate();


        const incomeElement =
            document.querySelector(
                ".summary-card:nth-child(1) strong"
            );


        const expenseElement =
            document.querySelector(
                ".summary-card:nth-child(2) strong"
            );


        const savingsElement =
            document.querySelector(
                ".summary-card:nth-child(3) strong"
            );


        const rateElement =
            document.querySelector(
                ".summary-card:nth-child(4) strong"
            );


        if (incomeElement) {

            incomeElement.textContent =
                formatNaira(income);

        }


        if (expenseElement) {

            expenseElement.textContent =
                formatNaira(expenses);

        }


        if (savingsElement) {

            savingsElement.textContent =
                formatNaira(savings);

        }


        if (rateElement) {

            rateElement.textContent =
                rate.toFixed(1) + "%";

        }


        updateComparisonText();

    }


    /* =====================================================
       COMPARISON TEXT
    ===================================================== */

    function updateComparisonText() {

        const cards =
            document.querySelectorAll(
                ".summary-card"
            );


        cards.forEach(
            function (card) {

                const paragraph =
                    card.querySelector(
                        ".summary-info p"
                    );


                if (!paragraph) {
                    return;
                }


                paragraph.innerHTML =
                    `<span class="positive">
                        Current selected month
                    </span>`;

            }
        );

    }


    /* =====================================================
       SPENDING BY CATEGORY
    ===================================================== */

    function getCategoryTotals() {

        const categories = {};


        getMonthTransactions()

            .filter(
                transaction =>
                    transaction.type ===
                    "expense"
            )

            .forEach(
                function (transaction) {

                    const category =
                        transaction.category ||
                        "Others";


                    if (
                        !categories[category]
                    ) {

                        categories[category] =
                            0;

                    }


                    categories[category] +=
                        Number(
                            transaction.amount ||
                            0
                        );

                }
            );


        return categories;

    }


    /* =====================================================
       UPDATE CATEGORY PANEL
    ===================================================== */

    function updateCategoryPanel() {

        const categories =
            getCategoryTotals();


        const totalExpenses =
            getMonthExpenses();


        const categoryList =
            document.querySelector(
                ".category-list"
            );


        const donutCenter =
            document.querySelector(
                ".donut-center strong"
            );


        if (donutCenter) {

            donutCenter.textContent =
                formatNaira(totalExpenses);

        }


        if (!categoryList) {
            return;
        }


        categoryList.innerHTML = "";


        const entries =
            Object.entries(
                categories
            )
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


        if (entries.length === 0) {

            categoryList.innerHTML = `
                <div class="empty-report">
                    No expenses recorded
                    for ${months[selectedMonth]}.
                </div>
            `;

            updateDonut([]);

            return;

        }


        entries.forEach(
            function (
                [category, amount],
                index
            ) {

                const percentage =
                    totalExpenses > 0
                        ? (
                            amount /
                            totalExpenses
                        ) * 100
                        : 0;


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "category-row";


                row.innerHTML = `

                    <span>
                        <i
                            class="dot report-dot-${index % 6}">
                        </i>

                        ${escapeHTML(category)}
                    </span>

                    <strong>
                        ${formatNaira(amount)}
                    </strong>

                    <small>
                        ${percentage.toFixed(1)}%
                    </small>

                `;


                categoryList.appendChild(
                    row
                );

            }
        );


        updateDonut(entries);

    }


    /* =====================================================
       UPDATE DONUT
    ===================================================== */

    function updateDonut(entries) {

        const donut =
            document.querySelector(
                ".donut"
            );


        if (!donut) {
            return;
        }


        if (
            !entries ||
            entries.length === 0
        ) {

            donut.style.background =
                "#24384a";

            return;

        }


        const colors = [
            "#ef3048",
            "#0878ee",
            "#ffb900",
            "#14b8b8",
            "#7040df",
            "#ff7515"
        ];


        let currentDegree = 0;

        const parts = [];


        entries.forEach(
            function ([, amount], index) {

                const total =
                    getMonthExpenses();


                const degree =
                    total > 0
                        ? (
                            amount /
                            total
                        ) * 360
                        : 0;


                parts.push(
                    `${colors[index % colors.length]}
                    ${currentDegree}deg
                    ${currentDegree + degree}deg`
                );


                currentDegree += degree;

            }
        );


        donut.style.background =
            `conic-gradient(
                ${parts.join(",")}
            )`;

    }


    /* =====================================================
       MONTHLY BAR CHART
    ===================================================== */

    function updateBarChart() {

        const bars =
            document.querySelectorAll(
                ".bar-group"
            );


        if (!bars.length) {
            return;
        }


        const transactions =
            getTransactions();


        const monthlyData =
            months.map(
                function (_, monthIndex) {

                    let income = 0;
                    let expense = 0;


                    transactions.forEach(
                        function (transaction) {

                            if (!transaction.date) {
                                return;
                            }


                            const date =
                                new Date(
                                    transaction.date +
                                    "T00:00:00"
                                );


                            if (
                                date.getFullYear() ===
                                selectedYear &&
                                date.getMonth() ===
                                monthIndex
                            ) {

                                if (
                                    transaction.type ===
                                    "income"
                                ) {

                                    income +=
                                        Number(
                                            transaction.amount ||
                                            0
                                        );

                                }


                                if (
                                    transaction.type ===
                                    "expense"
                                ) {

                                    expense +=
                                        Number(
                                            transaction.amount ||
                                            0
                                        );

                                }

                            }

                        }
                    );


                    return {
                        income,
                        expense
                    };

                }
            );


        const maxValue =
            Math.max(
                1,
                ...monthlyData.map(
                    item =>
                        Math.max(
                            item.income,
                            item.expense
                        )
                )
            );


        bars.forEach(
            function (
                group,
                index
            ) {

                if (
                    index >=
                    monthlyData.length
                ) {
                    return;
                }


                const incomeBar =
                    group.querySelector(
                        ".income-bar"
                    );


                const expenseBar =
                    group.querySelector(
                        ".expense-bar"
                    );


                const label =
                    group.querySelector(
                        "label"
                    );


                const data =
                    monthlyData[index];


                if (incomeBar) {

                    incomeBar.style.height =
                        (
                            data.income /
                            maxValue
                        ) * 100 + "%";

                }


                if (expenseBar) {

                    expenseBar.style.height =
                        (
                            data.expense /
                            maxValue
                        ) * 100 + "%";

                }


                if (label) {

                    label.textContent =
                        months[index].substring(
                            0,
                            3
                        );

                }

            }
        );

    }


    /* =====================================================
       MONTHLY SPENDING TREND
    ===================================================== */

    function updateTrendChart() {

        const transactions =
            getTransactions();


        const monthlyExpenses =
            months.map(
                function (_, monthIndex) {

                    return transactions

                        .filter(
                            function (
                                transaction
                            ) {

                                if (
                                    !transaction.date
                                ) {

                                    return false;

                                }


                                const date =
                                    new Date(
                                        transaction.date +
                                        "T00:00:00"
                                    );


                                return (
                                    date.getFullYear() ===
                                    selectedYear &&
                                    date.getMonth() ===
                                    monthIndex &&
                                    transaction.type ===
                                    "expense"
                                );

                            }
                        )

                        .reduce(
                            function (
                                total,
                                transaction
                            ) {

                                return total +
                                    Number(
                                        transaction.amount ||
                                        0
                                    );

                            },
                            0
                        );

                }
            );


        const max =
            Math.max(
                1,
                ...monthlyExpenses
            );


        const svg =
            document.querySelector(
                ".trend-svg"
            );


        const values =
            document.querySelector(
                ".trend-values"
            );


        const monthLabels =
            document.querySelector(
                ".trend-months"
            );


        if (
            !svg ||
            !values ||
            !monthLabels
        ) {

            return;

        }


        /*
           Use six displayed points to fit
           the existing chart design.
        */

        const displayCount = 6;

        const selectedData =
            monthlyExpenses.slice(
                0,
                displayCount
            );


        const width = 525;
        const height = 170;

        const startX = 30;
        const endX = 555;


        const points =
            selectedData.map(
                function (
                    value,
                    index
                ) {

                    const x =
                        selectedData.length <= 1
                            ? startX
                            : startX +
                              (
                                  index /
                                  (
                                      selectedData.length -
                                      1
                                  )
                              ) *
                              (
                                  endX -
                                  startX
                              );


                    const y =
                        20 +
                        (
                            1 -
                            (
                                value /
                                max
                            )
                        ) * 145;


                    return {
                        x,
                        y,
                        value
                    };

                }
            );


        if (!points.length) {
            return;
        }


        const linePoints =
            points
                .map(
                    point =>
                        `${point.x},${point.y}`
                )
                .join(" ");


        const areaPoints =
            `${linePoints}
             ${endX},210
             ${startX},210`;


        svg.innerHTML = `

            <polygon
                points="${areaPoints}"
                fill="rgba(239, 48, 67, 0.18)">
            </polygon>

            <polyline
                points="${linePoints}"
                fill="none"
                stroke="#ff3048"
                stroke-width="3">
            </polyline>

            ${
                points.map(
                    point => `
                        <circle
                            cx="${point.x}"
                            cy="${point.y}"
                            r="5">
                        </circle>
                    `
                ).join("")
            }

        `;


        values.innerHTML =
            points.map(
                point =>
                    `<span>
                        ${formatCompactNaira(point.value)}
                    </span>`
            ).join("");


        monthLabels.innerHTML =
            selectedData.map(
                function (_, index) {

                    return `
                        <span>
                            ${months[index].substring(
                                0,
                                3
                            )}
                        </span>
                    `;

                }
            ).join("");

    }


    /* =====================================================
       COMPACT NAIRA
    ===================================================== */

    function formatCompactNaira(amount) {

        const value =
            Number(amount || 0);


        if (value >= 1000000) {

            return "₦" +
                (
                    value /
                    1000000
                ).toFixed(1) +
                "M";

        }


        if (value >= 1000) {

            return "₦" +
                (
                    value /
                    1000
                ).toFixed(1) +
                "K";

        }


        return "₦" +
            Math.round(value);

    }


    /* =====================================================
       TOP SPENDING CATEGORIES
    ===================================================== */

    function updateTopSpending() {

        const categories =
            getCategoryTotals();


        const total =
            getMonthExpenses();


        const list =
            document.querySelector(
                ".spending-list"
            );


        if (!list) {
            return;
        }


        list.innerHTML = "";


        const entries =
            Object.entries(
                categories
            )
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


        if (!entries.length) {

            list.innerHTML = `
                <div class="empty-report">
                    No spending recorded
                    for ${months[selectedMonth]}.
                </div>
            `;

            return;

        }


        entries
            .slice(0, 5)
            .forEach(
                function (
                    [category, amount],
                    index
                ) {

                    const percentage =
                        total > 0
                            ? (
                                amount /
                                total
                            ) * 100
                            : 0;


                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "spending-item";


                    item.innerHTML = `

                        <div class="spending-name">

                            <i
                                class="circle-icon
                                report-icon-${index % 6}">
                                ●
                            </i>

                            <span>
                                ${escapeHTML(category)}
                            </span>

                        </div>


                        <div class="progress">

                            <span
                                style="
                                    width:${percentage}%;
                                ">
                            </span>

                        </div>


                        <strong>
                            ${formatNaira(amount)}
                        </strong>


                        <small>
                            ${percentage.toFixed(1)}%
                        </small>

                    `;


                    list.appendChild(
                        item
                    );

                }
            );

    }


    /* =====================================================
       SAVINGS MESSAGE
    ===================================================== */

    function updateSavingsMessage() {

        const savings =
            getNetSavings();


        const strong =
            document.querySelector(
                ".saving-message p strong"
            );


        const text =
            document.querySelector(
                ".saving-message span"
            );


        if (strong) {

            strong.textContent =
                formatNaira(
                    Math.max(
                        0,
                        savings
                    )
                );

        }


        if (text) {

            const goals =
                getSavingsGoals();


            if (goals.length) {

                text.textContent =
                    `You currently have
                    ${goals.length}
                    savings goal${
                        goals.length === 1
                            ? ""
                            : "s"
                    } in NairaPulse.`;

            } else {

                text.textContent =
                    "You have not created a savings goal yet.";

            }

        }

    }


    /* =====================================================
       SAVINGS GOALS BUTTON
    ===================================================== */

    const savingGoals =
        document.getElementById(
            "savingGoals"
        );


    if (savingGoals) {

        savingGoals.addEventListener(
            "click",
            function () {

                window.location.href =
                    "savings.html";

            }
        );

    }


    /* =====================================================
       EXPORT REPORT
    ===================================================== */

    const exportButton =
        document.getElementById(
            "exportReport"
        );


    if (exportButton) {

        exportButton.addEventListener(
            "click",
            function () {

                exportReport();

            }
        );

    }


    function exportReport() {

        const income =
            getMonthIncome();


        const expenses =
            getMonthExpenses();


        const savings =
            getNetSavings();


        const rate =
            getSavingsRate();


        const categories =
            getCategoryTotals();


        const goals =
            getSavingsGoals();


        let csv =
            "NAIRAPULSE FINANCIAL REPORT\n\n";


        csv +=
            "Report Month," +
            months[selectedMonth] +
            " " +
            selectedYear +
            "\n";


        csv +=
            "Total Income," +
            income +
            "\n";


        csv +=
            "Total Expenses," +
            expenses +
            "\n";


        csv +=
            "Net Savings," +
            savings +
            "\n";


        csv +=
            "Savings Rate," +
            rate.toFixed(1) +
            "%\n\n";


        csv +=
            "SPENDING BY CATEGORY\n";


        csv +=
            "Category,Amount,Percentage\n";


        Object.entries(
            categories
        )
        .sort(
            (a, b) =>
                b[1] - a[1]
        )
        .forEach(
            function (
                [category, amount]
            ) {

                const percentage =
                    expenses > 0
                        ? (
                            amount /
                            expenses
                        ) * 100
                        : 0;


                csv +=
                    `"${escapeCSV(category)}",` +
                    `${amount},` +
                    `${percentage.toFixed(1)}%\n`;

            }
        );


        csv +=
            "\nSAVINGS GOALS\n";


        csv +=
            "Goal,Target,Saved,Remaining,Target Date\n";


        goals.forEach(
            function (goal) {

                const target =
                    Number(
                        goal.target || 0
                    );


                const saved =
                    Number(
                        goal.saved || 0
                    );


                const remaining =
                    Math.max(
                        0,
                        target - saved
                    );


                csv +=
                    `"${escapeCSV(goal.name)}",` +
                    `${target},` +
                    `${saved},` +
                    `${remaining},` +
                    `"${escapeCSV(
                        goal.targetDate || ""
                    )}"\n`;

            }
        );


        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href = url;


        link.download =
            `NairaPulse_Report_${months[selectedMonth]}_${selectedYear}.csv`;


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        URL.revokeObjectURL(
            url
        );

    }


    function escapeCSV(value) {

        return String(
            value || ""
        ).replace(
            /"/g,
            '""'
        );

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

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
       UPDATE EVERYTHING
    ===================================================== */

    function updateReport() {

        updateSummaryCards();

        updateCategoryPanel();

        updateBarChart();

        updateTrendChart();

        updateTopSpending();

        updateSavingsMessage();

    }


    /* =====================================================
       UPDATE WHEN OTHER NAIRAPULSE PAGES CHANGE DATA
    ===================================================== */

    window.addEventListener(
        "storage",
        function (event) {

            if (
                event.key ===
                TRANSACTIONS_KEY ||
                event.key ===
                BUDGETS_KEY ||
                event.key ===
                GOALS_KEY
            ) {

                updateReport();

            }

        }
    );


    window.addEventListener(
        "nairapulseDataUpdated",
        function () {

            updateReport();

        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    createMonthSelector();

    updateReport();


    console.log(
        "NairaPulse Reports loaded successfully."
    );

});