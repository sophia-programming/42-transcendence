let backendHost;

const hostname = window?.location?.hostname;
const port = window?.location?.port;

if (hostname === "localhost" && port === 80) {
  backendHost = "localhost:80/backend";
} else {
  backendHost = "localhost:8000";
}

export const API_ROOT = `${backendHost}`;
