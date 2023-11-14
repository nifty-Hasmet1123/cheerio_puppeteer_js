import puppeteer from "puppeteer";

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// async function scrapePageData(page) {
//     const container = [];

//     const result = await page.evaluate(() => {
//         // get the selectors first
//         const prices = Array.from(document.querySelectorAll('p.price_color'));
//         const titleNodes = Array.from(document.querySelectorAll('h3 > a'));

//         const titleValues = titleNodes.map(title => title.getAttribute('title'));
//         const titleText = titleNodes.map(titleText => titleText.textContent);
//         const pricesValues = prices.map(price => price.textContent);
        
//         return { titleValues, titleText, pricesValues };
//     });

//     const { titleValues, titleText, pricesValues } = result;
    
//     for (let i = 0; i < titleValues.length; i++) {
//         let data = {
//             'title-attribute': titleValues[i],
//             'title-text': titleText[i],
//             'prices': pricesValues[i]
//         }
//         container.push(data);
//     }

//     return container;
// }

// scrape code helper function
async function scrapePageData(page) {
    const container = await page.evaluate(() => {
        const titleNodes = Array.from(document.querySelectorAll('h3 > a'));
        const prices = Array.from(document.querySelectorAll('p.price_color'));

        return titleNodes.map((title, index) => {
            return {
                'title-attribute': title.getAttribute('title'),
                'title-text': title.textContent,
                'prices': prices[index].textContent
            };
        });
    })

    return container;
}


async function browserCrawler() {
    let browser;

    try {
        // launch browser and open new blank page
        browser = await puppeteer.launch({
            // headless: "new"
            headless: false,
        });

        const page = await browser.newPage();

        // set viewport
        await page.setViewport({
            width: 1080,
            height: 768
        });

        // navigation timeout from default 30 seconds to 2 minutes
        page.setDefaultNavigationTimeout(2 * 60 * 1000)

        // navigate to url
        await page.goto('https://books.toscrape.com/');

        // scrape code here...
        const dataScrape = await scrapePageData(page);
        console.log(dataScrape);

        // click to second page and wait for navigation to complete
        // await Promise.all([
        //     page.click("a[href='catalogue/page-2.html']"),
        //     page.waitForNavigation(),
        // ]);

        // click to second page
        // page.click("a[href='catalogue/page-2.html']")

        // using xpath expression as argument
        // you need to use .$x method from the page instance then enter the xpath there.
        const [ nextPageLink ] = await page.$x("//a[@href='catalogue/page-2.html']");
        
        if (nextPageLink) {
            await nextPageLink.click();
            await page.waitForNavigation()
        };
        

        // scrape code here...

        // await for selector to appear in the browser
        await page.waitForSelector("a[href='page-3.html']")
        

        // wait for a short time after navigation (2 seconds)
        await delay(2000);

    } catch (error) {
        console.log(error);
    } finally {
        await browser?.close();
    }
}

browserCrawler();

// evaluate example

// const username = 'your_username';
// const password = 'your_password';

// const result = await page.evaluate((username, password) => {
//     // Code to interact with the login form using the provided username and password
//     // ...

//     // Return some result if needed
//     return { success: true };
// }, username, password);

// console.log(result);
