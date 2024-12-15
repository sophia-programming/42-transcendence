import { updateContent } from "../../utils/i18n.js";

const Login = {
  render: async () => {
    return (await fetch("/views/templates/Login.html")).text();
  },

  after_render: async () => {
    updateContent();

    document
      .getElementById("login-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();
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
            window.location.hash = "#/";
          } else {
            const errors = Object.entries(data)
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ");
            console.error("Login failed: ", errors);
            alert(`Login failed: ${errors || "Unknown error"}`);
          }
        } catch (error) {
          console.error("An error occurred: ", error);
          alert(`An error occurred: ${error.message || "Unknown error"}`);
        }
      });

    document
      .getElementById("oauth-login")
      .addEventListener("click", async (event) => {
        event.preventDefault();
        window.location.href = `${window.env.BACKEND_HOST}/oauth/`;
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
