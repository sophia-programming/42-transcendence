import { updateContent } from "../../utils/i18n.js";

const Login = {
  render: async () => {
    return `<main
                class="form-signin d-flex flex-column justify-content-center align-items-center"
                style="min-height: 80vh;"
                >
                <form id="login-form" method="post" action="/accounts/login/">
                    <div class="mb-3">
                    <label for="id_username" class="form-label" data-i18n="login:username">Username</label>
                    <input type="text" id="id_username" class="form-control" name="username" required />
                    </div>
                    <div class="mb-3">
                    <label for="id_password" class="form-label" data-i18n="login:password">Password</label>
                    <input type="password" id="id_password" class="form-control" name="password" required />
                    </div>
                    <input type="hidden" value="/accounts/verify_otp/" />
                    <button type="submit" class="btn btn-primary mb-2 w-100" data-i18n="login:login">Login</button>
                </form>
                <a href="/accounts/signup/" class="btn btn-secondary w-100 mb-2" style="max-width: 282px;" data-i18n="login:sign_up"
                    >Sign Up</a
                >
                <a id="oauth-login" class="btn btn-primary w-100" style="max-width: 282px;" data-i18n="login:login_with_42"
                    >Login with 42</a
                >
                </main>`;
  },

  after_render: async () => {
    updateContent();

    document
      .getElementById("login-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();
        let username = document.getElementById("id_username").value;
        let password = document.getElementById("id_password").value;

        const response = await fetch(
          `${window.env.BACKEND_HOST}/accounts/api/login/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          console.log("success: ", data);
          window.location.hash = "#/";
        } else {
          console.log("error: ", data);
        }
      });

    document
      .getElementById("oauth-login")
      .addEventListener("click", async (event) => {
        event.preventDefault();
        window.location.href = `${window.env.BACKEND_HOST}/oauth/`;
      });
  },
};

export default Login;
