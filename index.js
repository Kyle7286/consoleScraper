const puppeteer = require('puppeteer');
// Playstation URLS

// gametop
url_gameStop_playstation_dig = "https://www.gamestop.com/video-games/playstation-5/consoles/products/playstation-5-digital-edition/11108141.html?condition=New"
url_gameStop_playstation_stan = "https://www.gamestop.com/video-games/playstation-5/consoles/products/playstation-5/11108140.html?condition=New"

// Init Report
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
        walmart: {
            dig: "",
            stan: "",
        },
        target: {
            dig: "",
            stan: "",
        },
        amazon: {
            dig: "",
            stan: "",
        },
    }
};


// ---------------------------------------------------
//                  SCRAPERS
// ---------------------------------------------------

// GAMESTOP - Digital & Standard Edition
//  * This function will grab the availability of the PS5 from Gamestop websites
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
        const obj = await page.evaluate('document.querySelector("#add-to-cart").getAttribute("data-gtmdata")')

        // parse to an object and grab the value we want
        const avail = JSON.parse(obj).productInfo.availability

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
    report.playstation.gamestop.dig = await getGameStop_PS5(url_gameStop_playstation_dig)
    report.playstation.gamestop.stan = await getGameStop_PS5(url_gameStop_playstation_stan)

    console.log(report);
}

getAvailability();