"use strict";

import Navbar from "./views/components/Navbar.js";
import Login from "./views/pages/Login.js";
import Logout from "./views/pages/Logout.js";
import SignUp from "./views/pages/SignUp.js";
import SetupOtp from "./views/pages/SetUpOtp.js";
import VerifyOtp from "./views/pages/VerifyOtp.js";
import Home from "./views/pages/Home.js";
import Gameplay from "./views/pages/Gameplay.js";
import Tournament from "./views/pages/Tournament.js";

const routes = {
  "/": Home,
  "/login": Login,
  "/logout": Logout,
  "/signup": SignUp,
  "/setup-otp": SetupOtp,
  "/verify-otp": VerifyOtp,
  "/gameplay": Gameplay,
  "/tournament": Tournament,
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const val = parts.pop().split(";").shift();
    return val && val.length > 0 ? val : null;
  }
  return null;
};

const router = async () => {
  const header = null || document.getElementById("header_container");
  const body = null || document.getElementById("body_container");
  const footer = null || document.getElementById("footer_container");

  const location = window.location.hash.slice(1).toLowerCase() || "/";
  console.log(location);

  if (window.currentPage && window.currentPage.cleanup) {
    window.currentPage.cleanup();
  }

  const page = routes[location];
  window.currentPage = page;

  if (getCookie("token")) {
    const loginButton = document.getElementById("navbar:login");
    if (loginButton) {
      loginButton.setAttribute("href", "#/logout");
      loginButton.setAttribute("data-i18n", "navbar:logout");
      loginButton.id = "navbar:logout";
      loginButton.textContent = "Logout";
    }
    if (getCookie("token") != "dummy") {
      const setupOtpButton = document.getElementById("navbar:setup-otp");
      if (setupOtpButton) {
        setupOtpButton.setAttribute("href", "#/setup-otp");
        setupOtpButton.classList.remove("disabled");
      }
    }
  }

  // footer

  body.innerHTML = await page.render();
  await page.after_render();
};

window.addEventListener("hashchange", router);

window.addEventListener("load", router);

window.addEventListener("DOMContentLoaded", Navbar.setTranslateHook());
