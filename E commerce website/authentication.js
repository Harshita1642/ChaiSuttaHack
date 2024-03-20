document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-in');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const username = form.elements.username.value;
        const password = form.elements.password.value;
        const authenticated = authenticate(username, password);

        if (authenticated) {
            window.location.href = "test.html"; 
        } else {
            alert('Incorrect username or password');
        }
    });

    function authenticate(username, password) {
        if (username === "admin" && password === "password") {
            return true;
        } else {
            return false;
        }
    }
});
