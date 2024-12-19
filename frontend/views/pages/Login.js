import { updateContent } from "../../utils/i18n.js";

const Login = {
  render: async () => {
    return (await fetch("/views/templates/Login.html")).text();
  },

  after_render: async () => {
    updateContent();

    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!loginForm.checkValidity()) {
        event.stopPropagation();
        loginForm.classList.add("was-validated");
        return;
      }

      loginForm.classList.add("was-validated");

      let username = document.getElementById("id_username").value;
      let password = document.getElementById("id_password").value;

      try {
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
          console.log("Login success: ", data);
          document.cookie = `token=${data.token}; path=/; Secure; SameSite=Strict; max-age=86400`;
          window.location.hash = "#/";
        } else {
          const errors = Object.entries(data)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ");
          console.error("Login failed: ", errors);
          alert(i18next.t("login:errors.login"));
        }
      } catch (error) {
        console.error("An error occurred: ", error);
        alert(i18next.t("login:errors.unknown"));
      }
    });

    document
      .getElementById("oauth-login")
      .addEventListener("click", async (event) => {
        event.preventDefault();
        window.location.href = `${window.env.BACKEND_HOST}/oauth/`;
        document.cookie = `token=dummy; path=/; Secure; SameSite=Strict; max-age=86400`;
      });

    document
      .getElementById("sign-up")
      .addEventListener("click", async (event) => {
        event.preventDefault();
        window.location.hash = "#/signup";
      });
  },
};

export default Login;
