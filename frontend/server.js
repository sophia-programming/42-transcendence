const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  const filePath = getFilePath(req.url);
  const contentType = getContentType(filePath);

  fs.readFile(filePath, "utf-8", (err, content) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
      return;
    }

    const renderedContent = content
      .replace(
        '<div id="header_container"></div>',
        `<div id="header_container">${headerContent}</div>`
      )
      .replace(
        '<div id="body_container"></div>',
        `<div id="body_container">${renderPage(req.url)}</div>`
      )
      .replace(
        '<script id="load_env"></script>',
        `<script>
          window.env = {
            BACKEND_HOST: '${process.env.BACKEND_HOST}',
            BACKEND_WS_HOST: '${process.env.BACKEND_WS_HOST}'
          };
        </script>`
      );
    //   .replace(
    //     '<div id="footer_container"></div>',
    //     `<div id="footer_container"></div>`
    //   );

    res.writeHead(200, { "Content-Type": contentType });
    res.end(renderedContent);
  });
});

const getFilePath = (url) => {
  return path.join(__dirname, url === "/" ? "index.html" : url);
};

const getContentType = (filePath) => {
  const extname = path.extname(filePath);

  switch (extname) {
    case ".js":
      return "application/javascript";
    case ".css":
      return "text/css";
    case ".json":
      return "application/json";
    case ".png":
      return "image/png";
    case ".jpg":
      return "image/jpg";
    case ".ico":
      return "image/x-icon";
    default:
      return "text/html";
  }
};

const renderPage = (url) => {
  switch (url) {
    case "/":
      return `<h1>Welcome to the Home Page</h1>`;
  }
};

const headerContent = `<nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#" data-i18n="navbar:navbar">Navbar</a>
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
                        <a class="nav-link active" href="#/" data-i18n="navbar:home">Home</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link active" href="#/gamesetting" data-i18n="navbar:gameplay">Gameplay</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#/tournament" data-i18n="navbar:tournament">Tournament</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#/setup-otp" data-i18n="navbar:setupotp">Setup Otp</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#/mypage" data-i18n="navbar:mypage">My Page</a>
                        </li>
                    </ul>
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="languageDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" data-i18n="navbar:language">
                            Language
                        </a>
                        <ul class="dropdown-menu dropdown-menu-start" aria-labelledby="languageDropdown">
                            <li><a class="dropdown-item" href="#" id="change_to_english" data-i18n="navbar:english">English</a></li>
                            <li><a class="dropdown-item" href="#" id="change_to_japanese" data-i18n="navbar:japanese">Japanese</a></li>
                            <li><a class="dropdown-item" href="#" id="change_to_chinese" data-i18n="navbar:chinese">Chinese</a></li>
                        </ul>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#/login" data-i18n="navbar:login">Login</a>
                        </li>
                    </ul>
                </div>
            </nav>`;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
