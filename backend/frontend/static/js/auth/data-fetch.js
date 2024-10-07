document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('error-message');

  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    errorMessage.textContent = '';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email, password);
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    try {
      const response = await fetch("/api/login/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (response.ok) {
          window.location.href = "/dashboard";
        } else {
          errorMessage.textContent = data.error || 'Login failed. Please check your credentials.';
        }
      } else {
        const text = await response.text();
        console.error("Received non-JSON response:", text);
        errorMessage.textContent = 'An unexpected error occurred. Please try again later.';
      }
    } catch (error) {
      console.error(error);
      errorMessage.textContent = 'An error occurred. Please try again later.';
    }
  });
});
