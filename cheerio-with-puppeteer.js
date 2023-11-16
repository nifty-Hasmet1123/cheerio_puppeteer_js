const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the page you want to scrape
  await page.goto('https://example.com');

  // Get the HTML content of the page
  const htmlContent = await page.content();

  // Use Cheerio to parse the HTML
  const $ = cheerio.load(htmlContent);

  // Now you can use jQuery-like syntax to manipulate the DOM
  $('h1').each((index, element) => {
    console.log($(element).text());
  });

  // Close the browser
  await browser.close();
})();


