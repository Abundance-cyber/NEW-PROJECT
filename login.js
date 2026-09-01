/* =========================================================
   NAIRAPULSE LOGIN JAVASCRIPT
   ========================================================= */

/* ================= GET ELEMENTS ================= */

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const loginMessage = document.getElementById("loginMessage");
const forgotPassword = document.getElementById("forgotPassword");

/* =========================================================
   SHOW / HIDE PASSWORD
   ========================================================= */

togglePassword.addEventListener("click", function () {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "🙈";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "👁";
    }
});

/* =========================================================
   LOGIN FORM
   ========================================================= */

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = emailInput.value.trim()
    const password = passwordInput.value.trim();

    /* Clear previous message */
    loginMessage.textContent = "";
    loginMessage.style.color = "#ffffff";

    /* ================= VALIDATION ================= */

    if (email === "") {
        showMessage(
            "Please enter your email address.",
            "#ff3344"
        );
        emailInput.focus();
        return;
    }

    if (!isValidEmail(email)) {
        showMessage(
            "Please enter a valid email address.",
            "#ff3344"
        );
        emailInput.focus();
        return;
    }

    if (password === "") {
        showMessage(
            "Please enter your password.",
            "#ff3344"
        );
        passwordInput.focus();
        return;
    }

    if (password.length < 8) {
        showMessage(
            "Password must contain at least 8 characters.",
            "#ff3344"
        );
        passwordInput.focus();
        return;
    }

    /* ================= SUCCESS ================= */
    showMessage(
        "Login successful! Redirecting...",
        "#00e676"
    );
    setTimeout(function () {
        window.location.href = "dashboard.html";
    }, 1200);
});

/* =========================================================
   EMAIL VALIDATION
   ========================================================= */

function isValidEmail(email) {
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

/* =========================================================
   DISPLAY MESSAGE
   ========================================================= */

function showMessage(message, color) {
    loginMessage.textContent = message;
    loginMessage.style.color = color;
}

/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

forgotPassword.addEventListener("click", function (event) {
    event.preventDefault();
    const email = emailInput.value.trim();

    if (email === "") {
        showMessage(
            "Enter your email address first.",
            "#ffb000"
        );
        emailInput.focus();
        return;
    }

    if (!isValidEmail(email)) {
        showMessage(
            "Please enter a valid email address.",
            "#ff3344"
        );
        emailInput.focus();
        return;
    }

    showMessage(
        "Password reset instructions would be sent to your email.",
        "#00e676"
    );
}); 