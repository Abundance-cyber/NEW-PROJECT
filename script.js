//waiting for browser to load
document.addEventListener('DOMContentLoaded', () => {
    const leadForm = document.getElementById('lead-form'); // finding the html element
    const emailInput = document.getElementById('user-email'); //finding the html element

    // Handle Hero Section Lead Generation Event submission loops
    if (leadForm) { // A safety check to make sure the form actually exists on the page before trying to listen to it.
        leadForm.addEventListener('submit', (event) => { //  Listens for when the user clicks the "Get Started" button or hits the Enter key inside the form.
            event.preventDefault(); // This stops the browser from reloading the entire webpage. This allows the page to submit data without a jarring reload.
            
            const emailValue = emailInput.value.trim(); // it deletes any accidental blank spaces
            
            // change the button text to verifying and disables the button to prevent the user from submitting multiple entries
            if (emailValue) {
                // Flash interaction processing state directly onto the UI button wrapper
                const submitBtn = leadForm.querySelector('.btn-submit');
                const initialText = submitBtn.textContent;
                
                submitBtn.textContent = 'Verifying...';
                submitBtn.style.opacity = '0.8';
                submitBtn.disabled = true;

                // alert, verification successful
                //Pops up a built-in browser window welcoming the user and showing the email address they just registered.
                setTimeout(() => {
                    alert(`Welcome to NairaPulse! Verification link dispatched securely to: ${emailValue}`);
                    
                    // Reset field configuration post-handshake trigger
                    emailInput.value = '';
                    submitBtn.textContent = initialText;
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                }, 1000); // This delays the actions inside it by 1 second (1000 milliseconds) to simulate the app connecting to a backend server database.
            }
        });
    }
});



document.getElementById("lead-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const button = document.querySelector(".btn-submit");

    // Change button text while loading
    button.textContent = "Loading...";
    button.disabled = true;

    // Wait 1.5 seconds before opening dashboard
    setTimeout(function() {
        window.location.href = "dashboard.html";
    }, 5000);
});
