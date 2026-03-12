const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
require("dotenv").config({ path: path.join(root, ".env") });
const envProduction = path.join(root, ".env.production");
if (fs.existsSync(envProduction)) {
  require("dotenv").config({ path: envProduction });
}

const appUrl = process.env.VITE_APP_URL || "http://localhost:5173";
const manifest = {
  url: appUrl,
  name: "SAI Control",
  iconUrl: "https://ton.org/favicon.ico",
};

const outputPath = path.join(__dirname, "..", "frontend", "public", "tonconnect-manifest.json");
fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
