"use strict";

import Navbar from "./views/components/Navbar.js";
import Login from "./views/pages/Login.js";
import Home from "./views/pages/Home.js";
import Gameplay from "./views/pages/Gameplay.js";

const routes = {
  "/": Home,
  "/login": Login,
  "/gameplay": Gameplay,
};

const router = async () => {
  const header = null || document.getElementById("header_container");
  const body = null || document.getElementById("body_container");
  const footer = null || document.getElementById("footer_container");

  header.innerHTML = await Navbar.render();
  await Navbar.after_render();
  // footer

  const location = window.location.hash.slice(1).toLowerCase() || "/";
  console.log(location);

  const page = routes[location];

  body.innerHTML = await page.render();
  await page.after_render();
};

window.addEventListener("hashchange", router);

window.addEventListener("load", router);
