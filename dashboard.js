/* =========================================================
   NAIRAPULSE DASHBOARD JAVASCRIPT
   ========================================================= */

/* =========================================================
   DATE BUTTON
   ========================================================= */

const dateButton = document.querySelector(".date-button"); //listens for the "Date Filter" button in the dashboard
if (dateButton) {
    dateButton.addEventListener("click", function () { //listens for when the user clicks the "Date Filter" button
        alert("Date filter is ready to be connected to your financial data.");
    });
}

/* =========================================================
   SIDEBAR MENU
   ========================================================= */

const menuItems = document.querySelectorAll(".menu-item");//find all the html elements with the class "menu-item" in the dashboard sidebar
menuItems.forEach(function (item) { //do something to each of the menu items in this collection
    item.addEventListener("click", function () {//listens for when the user clicks on any of the sidebar menu items
        menuItems.forEach(function (menu) { //
            menu.classList.remove("active");// removes the "active" class from all menu items, ensuring only the clicked item is highlighted
        });
        this.classList.add("active");// adds the "active" class to the clicked menu item, highlighting it in the sidebar
    });
});

/* =========================================================
   DASHBOARD DATA
   ========================================================= */
const dashboardData = { //placeholder data for the dashboard.
    balance: 11500,
    income: 12000,
    expenses: 850,
    savingsRate: 92.9,
    spendingCategories: {
        food: 25,
        rent: 20,
        utilities: 25,
        transportation: 15,
        shopping: 15
    },

    monthlyIncome: [
        7000,
        9200,
        10500,
        10000,
        12000,
        12000
    ],

    monthlyExpenses: [
        2200,
        2500,
        2700,
        2500,
        3500,
        2800
    ]
};

/* =========================================================
   CONSOLE CHECK
   ========================================================= */
console.log("NairaPulse Dashboard Loaded"); // logs a message to the console indicating that the dashboard script has been successfully loaded.
console.log("Dashboard Data:", dashboardData); // logs the dashboard data to the console for debugging purposes.