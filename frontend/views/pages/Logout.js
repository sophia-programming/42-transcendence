const Logout = {
  render: async () => {
    try {
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } catch (error) {
      console.error("Failed to clear cookies:", error);
      alert("An error occurred during logout process");
      return;
    }

    return (await fetch("/views/templates/Logout.html")).text();
  },

  after_render: async () => {
    const logoutButton = document.getElementById("navbar:logout");
    if (logoutButton) {
      logoutButton.setAttribute("href", "#/login");
      logoutButton.setAttribute("data-i18n", "navbar:login");
      logoutButton.id = "navbar:login";
      logoutButton.textContent = "Login";
    }

    const setupOtpButton = document.getElementById("navbar:setup-otp");
    if (setupOtpButton) {
      setupOtpButton.removeAttribute("href");
      setupOtpButton.classList.add("disabled");
    }
  },
};

export default Logout;
