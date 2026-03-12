const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const appUrl = process.env.VITE_APP_URL || "http://localhost:5173";
const manifest = {
  url: appUrl,
  name: "SAI Control",
  iconUrl: "https://ton.org/favicon.ico",
};

const outputPath = path.join(__dirname, "..", "frontend", "public", "tonconnect-manifest.json");
fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
