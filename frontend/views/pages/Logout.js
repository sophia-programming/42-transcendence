const Logout = {
  render: async () => {
    try {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("is_logged_in");
    } catch (error) {
      console.error("Failed to clear session storage:", error);
      alert("An error occurred during logout process");
      return;
    }

    return (await fetch("/views/templates/Logout.html")).text();
  },

  after_render: async () => {
    const logoutButton = document.getElementById("navbar:logout");
    console.log(logoutButton)
    if (logoutButton) {
      logoutButton.setAttribute("href", "#/login");
      logoutButton.setAttribute("data-i18n", "navbar:login");
      logoutButton.id = "navbar:login";
      logoutButton.textContent = "Login";
    }
  },
};

export default Logout;
