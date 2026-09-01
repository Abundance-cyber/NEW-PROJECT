/* =========================================================
   NAIRAPULSE - SAVINGS GOALS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Savings.js started");

    // =====================================================
    // GET HTML ELEMENTS
    // =====================================================

    const createGoalBtn =
        document.getElementById("createGoalBtn");

    const goalsTableBody =
        document.querySelector(".goals-panel tbody");

    const totalGoals =
        document.querySelector(
            '[data-savings="goals"] strong'
        );

    const totalSaved =
        document.querySelector(
            '[data-savings="saved"] strong'
        );

    const totalTarget =
        document.querySelector(
            '[data-savings="target"] strong'
        );

    const overallProgress =
        document.querySelector(
            '[data-savings="progress"] strong'
        );

    const donutPercentage =
        document.querySelector(
            ".donut-center strong"
        );


    // =====================================================
    // CHECK ELEMENTS
    // =====================================================

    console.log("Create button:", createGoalBtn);
    console.log("Table:", goalsTableBody);


    // =====================================================
    // LOAD GOALS FROM LOCAL STORAGE
    // =====================================================

    function getGoals() {

        const saved =
            localStorage.getItem(
                "nairapulse_savings_goals"
            );

        if (!saved) {
            return [];
        }

        try {
            return JSON.parse(saved);
        } catch (error) {

            console.error(
                "Could not read savings goals:",
                error
            );

            return [];
        }
    }


    // =====================================================
    // SAVE GOALS TO LOCAL STORAGE
    // =====================================================

    function saveGoals(goals) {

        localStorage.setItem(
            "nairapulse_savings_goals",
            JSON.stringify(goals)
        );

        console.log(
            "Savings goals saved:",
            goals
        );
    }


    // =====================================================
    // FORMAT MONEY
    // =====================================================

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


    // =====================================================
    // DISPLAY GOALS IN TABLE
    // =====================================================

    function renderGoals() {

        const goals = getGoals();

        goalsTableBody.innerHTML = "";


        goals.forEach(function (goal) {

            const row =
                document.createElement("tr");

            const target =
                Number(goal.target) || 0;

            const saved =
                Number(goal.saved) || 0;

            let progress = 0;

            if (target > 0) {

                progress =
                    (saved / target) * 100;
            }

            if (progress > 100) {
                progress = 100;
            }


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

                    <span class="status on-track">
                        ${
                            progress >= 100
                                ? "Completed"
                                : "On Track"
                        }
                    </span>

                </td>


                <td>

                    <button
                        class="action-btn"
                        type="button"
                        data-id="${goal.id}">
                        ⋮
                    </button>

                </td>

            `;


            goalsTableBody.appendChild(row);

        });


        updateSummary();

        setupActionButtons();
    }


    // =====================================================
    // PROTECT HTML
    // =====================================================

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text == null ? "" : text;

        return div.innerHTML;
    }


    // =====================================================
    // UPDATE SUMMARY
    // =====================================================

    function updateSummary() {

        const goals = getGoals();

        let savedTotal = 0;

        let targetTotal = 0;


        goals.forEach(function (goal) {

            savedTotal +=
                Number(goal.saved) || 0;

            targetTotal +=
                Number(goal.target) || 0;

        });


        const progress =
            targetTotal > 0
                ? (savedTotal / targetTotal) * 100
                : 0;


        if (totalGoals) {

            totalGoals.textContent =
                goals.length;
        }


        if (totalSaved) {

            totalSaved.textContent =
                formatNaira(savedTotal);
        }


        if (totalTarget) {

            totalTarget.textContent =
                formatNaira(targetTotal);
        }


        if (overallProgress) {

            overallProgress.textContent =
                progress.toFixed(1) + "%";
        }


        if (donutPercentage) {

            donutPercentage.textContent =
                progress.toFixed(1) + "%";
        }


        console.log(
            "Savings summary:",
            {
                goals: goals.length,
                saved: savedTotal,
                target: targetTotal,
                progress: progress
            }
        );
    }


    // =====================================================
    // CREATE NEW GOAL
    // =====================================================

    if (createGoalBtn) {

        createGoalBtn.addEventListener(
            "click",
            function () {

                const name =
                    prompt(
                        "Enter the name of your savings goal:"
                    );


                if (
                    !name ||
                    name.trim() === ""
                ) {
                    return;
                }


                const targetInput =
                    prompt(
                        "Enter your target amount:"
                    );


                const target =
                    Number(targetInput);


                if (
                    !targetInput ||
                    isNaN(target) ||
                    target <= 0
                ) {

                    alert(
                        "Please enter a valid target amount."
                    );

                    return;
                }


                const targetDate =
                    prompt(
                        "Enter target date (e.g. Dec 31, 2026):"
                    );


                if (!targetDate) {
                    return;
                }


                const goals =
                    getGoals();


                const newGoal = {

                    id: Date.now(),

                    name: name.trim(),

                    target: target,

                    saved: 0,

                    targetDate:
                        targetDate.trim()

                };


                goals.push(newGoal);


                saveGoals(goals);


                renderGoals();


                alert(
                    "Goal created successfully!"
                );

            }
        );

    }


    // =====================================================
    // ACTION BUTTONS
    // =====================================================

    function setupActionButtons() {

        const buttons =
            document.querySelectorAll(
                ".action-btn"
            );


        buttons.forEach(function (button) {

            button.onclick = function () {

                const goalId =
                    Number(
                        button.dataset.id
                    );


                showGoalActions(goalId);

            };

        });

    }


    // =====================================================
    // SHOW ACTIONS
    // =====================================================

    function showGoalActions(goalId) {

        const choice =
            prompt(
                "Choose an action:\n\n" +
                "1. Add Contribution\n" +
                "2. Update Goal\n" +
                "3. Delete Goal"
            );


        if (choice === "1") {

            addContribution(goalId);

        }

        else if (choice === "2") {

            updateGoal(goalId);

        }

        else if (choice === "3") {

            deleteGoal(goalId);

        }

    }


    // =====================================================
    // ADD CONTRIBUTION
    // =====================================================

    function addContribution(goalId) {

        const goals =
            getGoals();


        const goal =
            goals.find(function (item) {

                return Number(item.id) ===
                    Number(goalId);

            });


        if (!goal) {

            alert(
                "Goal could not be found."
            );

            return;
        }


        const amountInput =
            prompt(
                "Enter contribution amount:"
            );


        const amount =
            Number(amountInput);


        if (
            !amountInput ||
            isNaN(amount) ||
            amount <= 0
        ) {

            alert(
                "Please enter a valid amount."
            );

            return;
        }


        goal.saved =
            Number(goal.saved) + amount;


        if (
            goal.saved >
            Number(goal.target)
        ) {

            goal.saved =
                Number(goal.target);

        }


        saveGoals(goals);


        renderGoals();


        alert(
            "Contribution saved successfully!"
        );

    }


    // =====================================================
    // UPDATE GOAL
    // =====================================================

    function updateGoal(goalId) {

        const goals =
            getGoals();


        const goal =
            goals.find(function (item) {

                return Number(item.id) ===
                    Number(goalId);

            });


        if (!goal) {

            alert(
                "Goal could not be found."
            );

            return;
        }


        const newName =
            prompt(
                "Enter new goal name:",
                goal.name
            );


        if (
            !newName ||
            newName.trim() === ""
        ) {
            return;
        }


        const newTargetInput =
            prompt(
                "Enter new target amount:",
                goal.target
            );


        const newTarget =
            Number(newTargetInput);


        if (
            !newTargetInput ||
            isNaN(newTarget) ||
            newTarget <= 0
        ) {

            alert(
                "Please enter a valid target amount."
            );

            return;
        }


        const newDate =
            prompt(
                "Enter new target date:",
                goal.targetDate
            );


        if (!newDate) {
            return;
        }


        goal.name =
            newName.trim();

        goal.target =
            newTarget;

        goal.targetDate =
            newDate.trim();


        if (
            Number(goal.saved) >
            Number(goal.target)
        ) {

            goal.saved =
                Number(goal.target);

        }


        saveGoals(goals);


        renderGoals();


        alert(
            "Goal updated successfully!"
        );

    }


    // =====================================================
    // DELETE GOAL
    // =====================================================

    function deleteGoal(goalId) {

        const goals =
            getGoals();


        const goal =
            goals.find(function (item) {

                return Number(item.id) ===
                    Number(goalId);

            });


        if (!goal) {
            return;
        }


        const answer =
            confirm(
                "Are you sure you want to delete " +
                goal.name +
                "?"
            );


        if (!answer) {
            return;
        }


        const updatedGoals =
            goals.filter(function (item) {

                return Number(item.id) !==
                    Number(goalId);

            });


        saveGoals(updatedGoals);


        renderGoals();


        alert(
            "Goal deleted successfully!"
        );

    }


    // =====================================================
    // LOAD SAVED DATA
    // =====================================================

    renderGoals();

});