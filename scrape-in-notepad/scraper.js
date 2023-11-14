import * as cheerio from "cheerio";
import fs from "fs/promises";
// import { fileURLToPath } from "url";
// import path from "path";

// check where directory you are. this is very useful
console.log({
    "current working directory": process.cwd()
});

const asyncFunctionCall = async () => {
    const container = [];

    try {
        /////////  YOU CAN USE THIS OR YOU CAN USE RELATIVE IMPORT ///////// 
        // const currentFilePath = fileURLToPath(import.meta.url);
        // const currentDir = path.dirname(currentFilePath);
        // const filePath = path.join(currentDir, "html.txt");

        // USING RELATIVE IMPORT BY CHECKING WHICH DIRECTORY YOU ARE
        const filePath = "./scrape-in-notepad/html.txt";

        const data = await fs.readFile(filePath, "utf-8");
        const $ = cheerio.load(data);

        const articles = $('article.product_pod');

        articles.each((index, element) => {
            const title = $(element).find('h3 > a').attr('title');
            const textTitle = $(element).find('h3 > a').text();
            const price = $(element).find('div.product_price > p.price_color').text();
        
            container.push({
                title,
                textTitle,
                price
            });
        });

        return container;
    } catch (error) {
        console.error("ERROR READING FILE:", error);
        return null;
    }
};

let result = asyncFunctionCall();
result.then(console.log);

