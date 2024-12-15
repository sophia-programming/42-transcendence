import { updateContent } from "../../utils/i18n.js";

const SignUp = {
  render: async () => {
    return `
        <div class="container mt-5">
            <h2 class="mb-4" data-i18n="signup:title">Sign Up</h2>
            <form id="signup-form">
                <div class="mb-3">
                <label for="username" class="form-label" data-i18n="signup:username">Username</label>
                <input type="text" name="username" id="username" class="form-control" required />
                </div>
                <div class="mb-3">
                <label for="password" class="form-label" data-i18n="signup:password">Password</label>
                <input type="password" name="password" id="password" class="form-control" required />
                </div>
                <div class="mb-3">
                <label for="email" class="form-label" data-i18n="signup:email">Email</label>
                <input type="email" name="email" id="email" class="form-control" />
                </div>
                <button id="signup-button" type="submit" class="btn btn-primary w-100" data-i18n="signup:signupButton">Sign Up</button>
            </form>
        </div>`;
  },

  after_render: async () => {
    updateContent();

    document
      .getElementById("signup-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let email = document.getElementById("email").value;

        try {
          const response = await fetch(
            `${window.env.BACKEND_HOST}/accounts/api/signup/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username, password, email }),
            }
          );

          const data = await response.json();

          if (response.ok) {
            console.log("Signup successful: ", data);
            window.location.hash = "#/";
          } else {
            const errors = Object.entries(data)
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ");
            console.error("Signup failed: ", errors);
            alert(i18next.t("signup:errors.signup"));
          }
        } catch (error) {
          console.error("Error during signup: ", error);
          alert(i18next.t("signup:errors.unknown"));
        }
      });
  },
};

export default SignUp;
