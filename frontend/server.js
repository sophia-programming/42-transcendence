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

const headerContent = (await fetch("/views/templates/Navbar.html")).text();

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
