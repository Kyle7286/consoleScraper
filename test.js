const puppeteer = require('puppeteer');

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

        console.log(avail);

        // Close the browser session
        await browser.close()

        // Return the result
        return avail

    } catch (e) {
        console.log('Error', e);
    }
}

// Target
url_target_playstation_stan = "https://www.target.com/p/xbox-series-x-s-wireless-controller/-/A-81874852?preselect=82628663#lnk=sametab"
// url_target_playstation_stan = "https://www.target.com/p/playstation-5-digital-edition-console/-/A-81114596"

// Init
getTarget_PS5(url_target_playstation_stan);