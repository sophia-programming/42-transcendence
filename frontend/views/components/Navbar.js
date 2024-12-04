const Navbar = {
  render: async () => {
    return `<nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">Navbar</a>
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
                        <a class="nav-link active" href="#/">Home</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#/tournament">Tournament</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#/setup-otp">Setup Otp</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#/mypage">My Page</a>
                        </li>
                    </ul>
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                        <a class="nav-link" href="#/login">Login</a>
                        </li>
                    </ul>
                    </div>
                </div>
                </nav>`;
  },
  after_render: async () => {},
};

export default Navbar;
