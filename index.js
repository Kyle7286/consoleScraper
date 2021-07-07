const puppeteer = require('puppeteer');
const chalk = require('chalk')


// ---------------------------------------------------
//                  URLs
// ---------------------------------------------------

// GameStop
url_gameStop_playstation_dig = "https://www.gamestop.com/video-games/playstation-5/consoles/products/playstation-5-digital-edition/11108141.html?condition=New"
url_gameStop_playstation_stan = "https://www.gamestop.com/video-games/playstation-5/consoles/products/playstation-5/11108140.html?condition=New"

// BestBuy
url_bestBuy_playstation_stan = "https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149"
url_bestBuy_playstation_dig = "https://www.bestbuy.com/site/sony-playstation-5-digital-edition-console/6430161.p?skuId=6430161"

// Target
url_target_playstation_stan = "https://www.target.com/p/playstation-5-console/-/A-81114595"
url_target_playstation_dig = "https://www.target.com/p/playstation-5-digital-edition-console/-/A-81114596"

// Amazon
url_amazon_playstation_stan = "https://www.amazon.com/PlayStation-5-Console/dp/B08FC5L3RG/ref=sr_1_3?dchild=1&keywords=ps5&qid=1624822502&rnid=2941120011&s=videogames&sr=1-3"


// ---------------------------------------------------
//                Report Object
// ---------------------------------------------------

let report = {
    playstation: {
        gamestop: {
            dig: "",
            stan: "",
        },
        bestbuy: {
            dig: "",
            stan: "",
        },
        target: {
            dig: "",
            stan: "",
        },
        // amazon: {
        //     dig: "",
        //     stan: "",
        // },
    }
};

// ---------------------------------------------------
//                  SCRAPERS
// ---------------------------------------------------

// GAMESTOP - Digital & Standard Edition
//  * This function will grab the availability of the PS5
const getGameStop_PS5 = async (url) => {
    try {
        // Create a browser session with headless true so the browser doesnt show (think silent mode)
        const browser = await puppeteer.launch({ headless: true });

        // Create a new page
        const page = await browser.newPage();

        // Set userAgent so that websites don't block you
        page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36')

        // Visit the website
        await page.goto(url)

        // Wait for the element we are interested in to load
        await page.waitForSelector('#add-to-cart');

        // // Take a screenshot of the page
        // await page.screenshot({ path: 'gamestop_digital.png' });

        // Get the attribute data of the element
        const avail = await page.evaluate(() => {
            
            let element = document.querySelector("#add-to-cart").getAttribute("data-gtmdata")
            let availability = JSON.parse(element).productInfo.availability

            // parse data-attribute to an object and grab the value we want
            return availability === "Not Available" ? "Not Available" : null;

    })

        // Close the browser session
        await browser.close()

        // Return the result
        return avail

    } catch (e) {
        console.log('Error', e);
    }
}

// BESTBUY - Digital & Standard Edition
//  * This function will grab the availability of the PS5
const getBestBuy_PS5 = async (url) => {
    try {
        // Create a browser session with headless true so the browser doesnt show (think silent mode)
        const browser = await puppeteer.launch({ headless: true });

        // Create a new page
        const page = await browser.newPage();

        // Set userAgent so that websites don't block you
        page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36')

        // Visit the website
        await page.goto(url)

        // Wait for the element we are interested in to load
        await page.waitForSelector('.add-to-cart-button');

        // Get the attribute data of the element
        const avail = await page.evaluate('document.querySelector(".add-to-cart-button").innerHTML')

        // Close the browser session
        await browser.close()

        // Return the result
        return avail

    } catch (e) {
        console.log('Error', e);
    }
}

// TARGET - Digital & Standard Edition
//  * This function will grab the availability of the PS5
const getTarget_PS5 = async (url) => {
    try {
        // Create a browser session with headless true so the browser doesnt show (think silent mode)
        const browser = await puppeteer.launch({ headless: true });

        // Create a new page
        const page = await browser.newPage();

        // Set userAgent so that websites don't block you
        page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36')

        // Visit the website
        await page.goto(url)

        // Wait for the element we are interested in to load
        await page.waitForSelector('[data-test="flexible-fulfillment"]');

        // Get the attribute data of the element
        const avail = await page.evaluate(() => {
            let element = document.querySelector(".h-text-orangeDark");
            return element ? element.innerText : null;
        })

        // Close the browser session
        await browser.close()

        // Return the result
        return avail

    } catch (e) {
        console.log('Error', e);
    }
}

// AMAZON - Digital & Standard Edition
//  * This function will grab the availability of the PS5
const getAmazon_PS5 = async (url) => {
    try {
        // Create a browser session with headless true so the browser doesnt show (think silent mode)
        const browser = await puppeteer.launch({ headless: true });

        // Create a new page
        const page = await browser.newPage();

        // Set userAgent so that websites don't block you
        page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36')

        // Visit the website
        await page.goto(url)

        // Wait for the element we are interested in to load
        await page.waitForSelector('#availability');

        // Get the attribute data of the element
        const avail = await page.evaluate('document.querySelector("#availability.span").')

        // Close the browser session
        await browser.close()

        // Return the result
        return avail

    } catch (e) {
        console.log('Error', e);
    }
}

// ---------------------------------------------------
//                  Init Function
// ---------------------------------------------------
const getAvailability = async () => {

    console.log("")
    console.log("-START-")
    console.log("")


    // Gamestop
    let gx = await getGameStop_PS5(url_gameStop_playstation_stan)
    let gy = await getGameStop_PS5(url_gameStop_playstation_dig)

    report.playstation.gamestop.stan = gx
    report.playstation.gamestop.dig = gy

    console.log("======" + "GAMESTOP" + "======");
    if (gx != "Not Available") {
        console.log("Standard: " + chalk.green(url_gameStop_playstation_stan));
    } else {
        console.log("Standard: " + chalk.red(gx));
    }
    if (gy != "Not Available") {
        console.log("Digital: " + chalk.green(url_gameStop_playstation_dig));
    } else {
        console.log("Digital: " + chalk.red(gy));
    }
    console.log("==================");
    console.log("");

    // // Bestbuy
    let bx = await getBestBuy_PS5(url_bestBuy_playstation_stan)
    let by = await getBestBuy_PS5(url_bestBuy_playstation_dig)

    report.playstation.bestbuy.stan = bx
    report.playstation.bestbuy.dig = by

    console.log("======" + "BESTBUY" + "======");
    if (bx != "Sold Out") {
        console.log("Standard: " + chalk.green(bx));
    } else {
        console.log("Standard: " + chalk.red(bx));
    }
    if (by != "Sold Out") {
        console.log("Digital: " + chalk.green(by));
    } else {
        console.log("Digital: " + chalk.red(by));
    }
    console.log("==================");
    console.log("");


    // // Target
    let tx = await getTarget_PS5(url_target_playstation_stan)
    let ty = await getTarget_PS5(url_target_playstation_dig)
    report.playstation.target.stan = tx
    report.playstation.target.dig = ty

    console.log("======" + "TARGET" + "======");
    if (tx != "Sold out") {
        console.log("Standard: " + chalk.green(url_target_playstation_stan));

    } else {
        console.log("Standard: " + chalk.red(tx));
    }
    if (ty != "Sold out") {
        console.log("Digital: " + chalk.green(url_target_playstation_dig));

    } else {
        console.log("Digital: " + chalk.red(ty));
    }
    console.log("==================");



    // Amazon
    // report.playstation.amazon.stan = await getAmazon_PS5(url_amazon_playstation_stan)
    // console.log(report);





    console.log("Sleeping...");
    const timer = await setTimeout(() => {
        console.log("Slept for 10");
        getAvailability()
    }, 10000);

}


// Init
getAvailability()
