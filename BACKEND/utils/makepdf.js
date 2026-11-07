import puppeteer from "puppeteer";
import ejs from "ejs";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// One headless Chrome for the whole server. Launching Chrome is the slow part,
// so each request only opens a new tab instead of a new browser.
let browserPromise = null;

const getBrowser = () => {
  if (!browserPromise) {
    browserPromise = puppeteer
      .launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      })
      .then((browser) => {
        // If Chrome crashes or closes, launch a fresh one on the next request.
        browser.on("disconnected", () => {
          browserPromise = null;
        });
        return browser;
      })
      .catch((err) => {
        browserPromise = null;
        throw err;
      });
  }
  return browserPromise;
};

export const closeBrowser = async () => {
  if (!browserPromise) return;
  try {
    const browser = await browserPromise;
    await browser.close();
  } catch {
    // Already closed or never started: nothing to clean up.
  }
  browserPromise = null;
};

export const generatePdf = async (userData, points, certi) => {
  const html = await ejs.renderFile(join(__dirname, "../views/user.ejs"), {
    userData,
    points,
    certi,
  });

  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 15000 });
    return await page.pdf({ format: "A4" });
  } finally {
    // Always close the tab, even when rendering fails, so tabs don't pile up.
    await page.close();
  }
};
