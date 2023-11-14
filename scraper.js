import * as cheerio from "cheerio";

const asyncFunctionCall = async (link) => {
    // create container
    const container = [];

    // fetch data and get the text
    const response = await fetch(link);
    const data = await response.text();

    // instantiate data with cherrio library
    const $ = cheerio.load(data);

    // get the similar containers 
    // note: this will always fetch all data that has the same tag and class
    const articles = $('article.product_pod');

    // loop the article box model
    articles.each((index, element) => {

        // if you want value of a property use .attr
        const title = $(element).find('h3 > a').attr('title');

        // get the raw text of the tag
        const textTitle = $(element).find('h3 > a').text();

        // find the price by using css selector styles commands
        const price = $(element).find('div.product_price > p.price_color').text()
        
        // append the values to the empty array
        container.push({
            title,
            textTitle,
            price
        })
    });

    return container;
}


let result = asyncFunctionCall("https://books.toscrape.com/");
result.then(console.log);



// const price = $('div > p.price_color').map((idx, element) => {
//     return $(element).text();
// }).get();