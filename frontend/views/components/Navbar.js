import { setLanguage } from "/utils/i18n.js";

const Navbar = {
  render: async () => {
    return `<nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#" data-i18n="navbar">Navbar</a>
                    <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    >
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                        <a class="nav-link active" href="#/" data-i18n="home">Home</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link active" href="#/gameplay" data-i18n="gameplay">Gameplay</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#/tournament" data-i18n="tournament">Tournament</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#/setup-otp" data-i18n="setup-otp">Setup Otp</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#/mypage" data-i18n="my-page">My Page</a>
                        </li>
                    </ul>
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                        <a class="nav-link" href="#/login" data-i18n="login">Login</a>
                        </li>
                    </ul>
                    </div>
                </div>
            </nav>`;
  },
  after_render: async () => {
    const lang = localStorage.getItem("lang") || "en";
    await setLanguage(lang);
  },
};

export default Navbar;
