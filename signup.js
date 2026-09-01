/* =========================================
   NAIRAPULSE SIGNUP
========================================= */


document.addEventListener(
    "DOMContentLoaded",
    function () {


        const signupForm =
            document.getElementById("signupForm");


        const message =
            document.getElementById("signupMessage");


        if (!signupForm) {

            return;

        }


        signupForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                /* =========================
                   GET FORM VALUES
                ========================= */

                const name =
                    document
                        .getElementById("signupName")
                        .value
                        .trim();


                const email =
                    document
                        .getElementById("signupEmail")
                        .value
                        .trim();


                const password =
                    document
                        .getElementById("signupPassword")
                        .value;


                const confirmPassword =
                    document
                        .getElementById("confirmPassword")
                        .value;


                const terms =
                    document
                        .getElementById("terms")
                        .checked;


                /* =========================
                   VALIDATION
                ========================= */

                if (!name || !email || !password) {

                    showMessage(
                        "Please fill in all required fields.",
                        "error"
                    );

                    return;

                }


                if (password !== confirmPassword) {

                    showMessage(
                        "Passwords do not match.",
                        "error"
                    );

                    return;

                }


                if (!terms) {

                    showMessage(
                        "Please agree to the terms and conditions.",
                        "error"
                    );

                    return;

                }


                /* =========================
                   GET EXISTING USERS
                ========================= */

                let users = [];


                try {

                    users =
                        JSON.parse(
                            localStorage.getItem(
                                "nairapulseUsers"
                            )
                        ) || [];

                } catch (error) {

                    users = [];

                }


                /* =========================
                   CHECK EXISTING EMAIL
                ========================= */

                const existingUser =
                    users.find(
                        function (user) {

                            return (
                                user.email.toLowerCase() ===
                                email.toLowerCase()
                            );

                        }
                    );


                if (existingUser) {

                    showMessage(
                        "An account with this email already exists.",
                        "error"
                    );

                    return;

                }


                /* =========================
                   CREATE USER
                ========================= */

                const newUser = {

                    id: Date.now(),

                    name: name,

                    email: email,

                    password: password

                };


                users.push(newUser);


                /* =========================
                   SAVE USER
                ========================= */

                localStorage.setItem(
                    "nairapulseUsers",
                    JSON.stringify(users)
                );


                /* =========================
                   SAVE CURRENT USER
                ========================= */

                localStorage.setItem(
                    "nairapulseCurrentUser",
                    JSON.stringify({
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email
                    })
                );


                /* =========================
                   LOGIN STATUS
                ========================= */

                localStorage.setItem(
                    "nairapulseLoggedIn",
                    "true"
                );


                /* =========================
                   SUCCESS MESSAGE
                ========================= */

                showMessage(
                    "Account created successfully. Opening your dashboard...",
                    "success"
                );


                /* =========================
                   GO TO DASHBOARD
                ========================= */

                setTimeout(
                    function () {

                        window.location.href =
                            "dashboard.html";

                    },
                    800
                );

            }
        );


        /* =================================
           MESSAGE FUNCTION
        ================================= */

        function showMessage(
            text,
            type
        ) {

            message.textContent =
                text;


            if (type === "success") {

                message.style.color =
                    "#00d864";

            } else {

                message.style.color =
                    "#ff5265";

            }

        }

    }
);