import { changeLanguage } from "../../utils/i18n.js";

const Navbar = {
  // render: async () => {
  //   return `<nav class="navbar navbar-expand-lg bg-body-tertiary">
  //               <div class="container-fluid">
  //                   <a class="navbar-brand" href="#" data-i18n="navbar:navbar">Navbar</a>
  //                   <button
  //                   class="navbar-toggler"
  //                   type="button"
  //                   data-bs-toggle="collapse"
  //                   data-bs-target="#navbarNav"
  //                   aria-controls="navbarNav"
  //                   aria-expanded="false"
  //                   aria-label="Toggle navigation"
  //                   >
  //                   <span class="navbar-toggler-icon"></span>
  //                   </button>
  //                   <div class="collapse navbar-collapse" id="navbarNav">
  //                   <ul class="navbar-nav">
  //                       <li class="nav-item">
  //                       <a class="nav-link active" href="#/" data-i18n="navbar:home">Home</a>
  //                       </li>
  //                       <li class="nav-item">
  //                       <a class="nav-link active" href="#/gameplay" data-i18n="navbar:gameplay">Gameplay</a>
  //                       </li>
  //                       <li class="nav-item">
  //                       <a class="nav-link" href="#/tournament" data-i18n="navbar:tournament">Tournament</a>
  //                       </li>
  //                       <li class="nav-item">
  //                       <a class="nav-link" href="#/setup-otp" data-i18n="navbar:setupotp">Setup Otp</a>
  //                       </li>
  //                       <li class="nav-item">
  //                       <a class="nav-link" href="#/mypage" data-i18n="navbar:mypage">My Page</a>
  //                       </li>
  //                   </ul>
  //                   <ul class="navbar-nav ms-auto">
  //                       <li class="nav-item dropdown">
  //                       <a class="nav-link dropdown-toggle" href="#" id="languageDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" data-i18n="navbar:language">
  //                           Language
  //                       </a>
  //                       <ul class="dropdown-menu dropdown-menu-start" aria-labelledby="languageDropdown">
  //                           <li><a class="dropdown-item" href="#" id="change_to_english" data-i18n="navbar:english">English</a></li>
  //                           <li><a class="dropdown-item" href="#" id="change_to_japanese" data-i18n="navbar:japanese">Japanese</a></li>
  //                           <li><a class="dropdown-item" href="#" id="change_to_chinese" data-i18n="navbar:chinese">Chinese</a></li>
  //                       </ul>
  //                       </li>
  //                       <li class="nav-item">
  //                           <a class="nav-link" href="#/login" data-i18n="navbar:login">Login</a>
  //                       </li>
  //                   </ul>
  //               </div>
  //           </nav>`;
  // },

  after_render: async () => {},

  setTranslateHook: async () => {
    document.getElementById('change_to_english').addEventListener('click', (event) => {
      event.preventDefault();  // ページ遷移を防ぐ
      changeLanguage('en');
    });
    document.getElementById('change_to_japanese').addEventListener('click', (event) => {
      event.preventDefault();
      changeLanguage('ja');
    });
    document.getElementById('change_to_chinese').addEventListener('click', (event) => {
      event.preventDefault();
      changeLanguage('zh');
    });
  }
};

export default Navbar;
