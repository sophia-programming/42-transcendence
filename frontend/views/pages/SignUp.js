import { updateContent } from "../../utils/i18n.js";

const SignUp = {
  render: async () => {
    return (await fetch("/views/templates/signup.html")).text();
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
