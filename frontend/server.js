const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {
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
                        <a class="nav-link active" href="#/gameplay">Gameplay</a>
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

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
