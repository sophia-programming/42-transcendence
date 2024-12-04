"use strict";

import Navbar from "./views/components/Navbar.js";
import Login from "./views/pages/Login.js";
import Home from "./views/pages/Home.js";

const routes = {
  "/": Home,
  "/login": Login,
};

const router = async () => {
  const header = null || document.getElementById("header_container");
  const body = null || document.getElementById("body_container");
  const footer = null || document.getElementById("footer_container");

  header.innerHTML = await Navbar.render();
  await Navbar.after_render();
  // footer

  console.log(location);
  const location = window.location.pathname;
  if (location.length == 0) {
    location = "/";
  }

  const page = routes[location];

  body.innerHTML = await page.render();
  await page.after_render();
};

window.addEventListener("hashchange", router);

window.addEventListener("load", router);
