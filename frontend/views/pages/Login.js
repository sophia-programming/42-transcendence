const Login = {
  render: async () => {
    return `<main
                class="form-signin d-flex flex-column justify-content-center align-items-center"
                style="min-height: 80vh;"
                >
                <form id="login-form" method="post" action="/accounts/login/">
                    <div class="mb-3">
                    <label for="id_username" class="form-label">Username</label>
                    <input type="text" id="id_username" class="form-control" name="username" required />
                    </div>
                    <div class="mb-3">
                    <label for="id_password" class="form-label">Password</label>
                    <input type="password" id="id_password" class="form-control" name="password" required />
                    </div>
                    <input type="hidden" value="/accounts/verify_otp/" />
                    <button type="submit" class="btn btn-primary mb-2 w-100">Login</button>
                </form>
                <a href="/accounts/signup/" class="btn btn-secondary w-100 mb-2" style="max-width: 282px;"
                    >Sign Up</a
                >
                <a href="/oauth/oauth/" class="btn btn-primary w-100" style="max-width: 282px;"
                    >Login with 42</a
                >
                </main>`;
  },

  after_render: async () => {
    document
      .getElementById("login-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();
        let username = document.getElementById("id_username").value;
        let password = document.getElementById("id_password").value;

        const response = await fetch(
          "http://localhost:8000/accounts/api/login/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          }
        );

        if (response.ok) {
          console.log("success: " + response.content);
        } else {
          console.log("error: " + response.content);
        }
      });
  },
};

export default Login;
