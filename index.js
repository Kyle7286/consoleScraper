const puppeteer = require('puppeteer');
const chalk = require('chalk');
const nodemailer = require('nodemailer');
require('dotenv').config();

// ---------------------------------------------------
//                  URLs
// ---------------------------------------------------

// GameStop
// url_gameStop_playstation_dig = "https://www.gamestop.com/video-games/playstation-4/accessories/controllers/products/sony-dualshock-4-black-wireless-controller/10136481.html?condition=New"

url_gameStop_playstation_dig = "https://www.gamestop.com/video-games/playstation-5/consoles/products/playstation-5-digital-edition/11108141.html?condition=New"
url_gameStop_playstation_stan = "https://www.gamestop.com/video-games/playstation-5/consoles/products/playstation-5/11108140.html?condition=New"

// BestBuy
// url_bestBuy_playstation_stan = "https://www.bestbuy.com/site/sony-playstation-pulse-3d-wireless-headset-compatible-for-both-playstation-4-playstation-5-white/6430164.p?skuId=6430164"

url_bestBuy_playstation_stan = "https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149"
url_bestBuy_playstation_dig = "https://www.bestbuy.com/site/sony-playstation-5-digital-edition-console/6430161.p?skuId=6430161"

// Target
// url_target_playstation_stan = "https://www.target.com/p/xbox-series-x-s-wireless-controller/-/A-81874852"

url_target_playstation_stan = "https://www.target.com/p/playstation-5-console/-/A-81114595"
url_target_playstation_dig = "https://www.target.com/p/playstation-5-digital-edition-console/-/A-81114596"

// Amazon
url_amazon_playstation_stan = "https://www.amazon.com/PlayStation-5-Console/dp/B08FC5L3RG/ref=sr_1_3?dchild=1&keywords=ps5&qid=1624822502&rnid=2941120011&s=videogames&sr=1-3"


// ---------------------------------------------------
//                  SCRAPERS
// ---------------------------------------------------

// GAMESTOP - Digital & Standard Edition
//  * This function will grab the availability of the PS5
const getGameStop_PS5 = async (page) => {
    try {
        // // Create a browser session with headless true so the browser doesnt show (think silent mode)
        // const browser = await puppeteer.launch({ headless: true });

        // // Create a new page
        // const page = await browser.newPage();

        // // Set userAgent so that websites don't block you
        // page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36')

        // // Visit the website
        // await page.goto(url)

        // Wait for the element we are interested in to load
        await page.waitForSelector('#add-to-cart');

        // Get the attribute data of the element
        const avail = await page.evaluate(() => {

            let element = document.querySelector("#add-to-cart").getAttribute("data-gtmdata")
            let availability = JSON.parse(element).productInfo.availability

            // parse data-attribute to an object and grab the value we want
            return availability === "Not Available" ? false : true;

        })

        // // Close the browser session
        // await browser.close()

        // Return the result
        return avail

    } catch (e) {
        console.log('Error', e);
    }
}

// BESTBUY - Digital & Standard Edition
//  * This function will grab the availability of the PS5
const getBestBuy_PS5 = async (page) => {
    try {
        // // Create a browser session with headless true so the browser doesnt show (think silent mode)
        // const browser = await puppeteer.launch({ headless: true });

        // // Create a new page
        // const page = await browser.newPage();

        // // Set userAgent so that websites don't block you
        // page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36')

        // // Visit the website
        // await page.goto(url);

        // Wait for the element we are interested in to load
        await page.waitForSelector('.add-to-cart-button');

        // Get the attribute data of the element
        const avail = await page.evaluate(() => {
            let element = document.querySelector(".add-to-cart-button").innerHTML;
            return element === "Sold Out" ? false : true;
        })

        // // Close the browser session
        // await browser.close();

        // Return the result
        return avail

    } catch (e) {
        console.log('Error', e);
    }
}

// TARGET - Digital & Standard Edition
//  * This function will grab the availability of the PS5
const getTarget_PS5 = async (page) => {
    try {
        // // Create a browser session with headless true so the browser doesnt show (think silent mode)
        // const browser = await puppeteer.launch({ headless: true });

        // // Create a new page
        // const page = await browser.newPage();

        // // Set userAgent so that websites don't block you
        // page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36')

        // // Visit the website
        // await page.goto(url)

        // Wait for the element we are interested in to load
        await page.waitForSelector('[data-test="flexible-fulfillment"]');

        // Get the attribute data of the element
        const avail = await page.evaluate(() => {
            // let element = document.querySelector(".h-text-orangeDark");
            let element = document.querySelector('[data-test="orderPickupButton"]');

            return element ? true : false;


        })

        // // Close the browser session
        // await browser.close()

        // Return the result
        return avail

    } catch (e) {
        console.log('Error', e);
    }
}

// AMAZON - Digital & Standard Edition
//  * This function will grab the availability of the PS5
const getAmazon_PS5 = async (page) => {
    try {
        // // Create a browser session with headless true so the browser doesnt show (think silent mode)
        // const browser = await puppeteer.launch({ headless: true });

        // // Create a new page
        // const page = await browser.newPage();

        // // Set userAgent so that websites don't block you
        // page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36')

        // Visit the website
        await page.goto(url)

        // Wait for the element we are interested in to load
        await page.waitForSelector('#availability');

        // Get the attribute data of the element
        const avail = await page.evaluate('document.querySelector("#availability.span").')

        // // Close the browser session
        // await browser.close()

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
    let consoleAvailable = false;

    // Report Object
    let report = {
        gamestop_ps_dig: "",
        gamestop_ps_stan: "",

        bestbuy_ps_dig: "",
        bestbuy_ps_stan: "",

        target_ps_dig: "",
        target_ps_stan: "",
    };

    console.log("")
    console.log("-START-")
    console.log("")


    // Create a browser session with headless true so the browser doesnt show (think silent mode)
    const browser = await puppeteer.launch({ headless: false });

    // Open a tab for each link
    const page_gs_stan = await browser.newPage();
    const page_gs_dig = await browser.newPage();

    const page_bb_stan = await browser.newPage();
    const page_bb_dig = await browser.newPage();

    const page_tar_stan = await browser.newPage();
    const page_tar_dig = await browser.newPage();

    // Set the user agent to mimic an actual user and not a robot so the websites don't know, haha!
    let userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36'

    // Set userAgent so that websites don't block you
    page_gs_stan.setUserAgent(userAgent)
    page_gs_dig.setUserAgent(userAgent)

    page_bb_stan.setUserAgent(userAgent)
    page_bb_dig.setUserAgent(userAgent)

    page_tar_stan.setUserAgent(userAgent)
    page_tar_dig.setUserAgent(userAgent)

    // Navigate to each URL
    await page_gs_stan.goto(url_gameStop_playstation_stan)
    await page_gs_dig.goto(url_gameStop_playstation_dig)

    await page_bb_stan.goto(url_bestBuy_playstation_stan)
    await page_bb_dig.goto(url_bestBuy_playstation_dig)

    await page_tar_stan.goto(url_target_playstation_stan)
    await page_tar_dig.goto(url_target_playstation_dig)

    // Get Result back from GameStop
    let gx = await getGameStop_PS5(page_gs_stan)
    let gy = await getGameStop_PS5(page_gs_dig)

    // Get Result back from Bestbuy
    let bx = await getBestBuy_PS5(page_bb_stan)
    let by = await getBestBuy_PS5(page_bb_dig)

    // Get Result back from Target
    let tx = await getTarget_PS5(page_tar_stan)
    let ty = await getTarget_PS5(page_tar_dig)


    report.gamestop_ps_stan = false
    report.gamestop_ps_dig = false

    console.log("======" + "GAMESTOP" + "======");
    if (gx) {
        console.log("Standard: " + chalk.green(url_gameStop_playstation_stan));
        report.gamestop_ps_stan = url_gameStop_playstation_stan;
        consoleAvailable = true;

    } else {
        console.log("Standard: " + chalk.red(gx));
    }
    if (gy) {
        console.log("Digital: " + chalk.green(url_gameStop_playstation_dig));
        report.gamestop_ps_dig = url_gameStop_playstation_dig;
        consoleAvailable = true;
    } else {
        console.log("Digital: " + chalk.red(gy));
    }
    console.log("==================");
    console.log("");

    // // // Bestbuy
    // let bx = await getBestBuy_PS5(url_bestBuy_playstation_stan)
    // let by = await getBestBuy_PS5(url_bestBuy_playstation_dig)

    report.bestbuy_ps_stan = false
    report.bestbuy_ps_dig = false

    console.log("======" + "BESTBUY" + "======");
    if (bx) {
        console.log("Standard: " + chalk.green(url_bestBuy_playstation_stan));
        report.bestbuy_ps_stan = url_bestBuy_playstation_stan;
        consoleAvailable = true;

    } else {
        console.log("Standard: " + chalk.red(bx));
    }
    if (by) {
        console.log("Digital: " + chalk.green(url_bestBuy_playstation_dig));
        report.bestbuy_ps_dig = url_bestBuy_playstation_dig;
        consoleAvailable = true;

    } else {
        console.log("Digital: " + chalk.red(by));
    }
    console.log("==================");
    console.log("");


    // // Target
    // let tx = await getTarget_PS5(url_target_playstation_stan)
    // let ty = await getTarget_PS5(url_target_playstation_dig)

    report.target_ps_stan = false
    report.target_ps_dig = false

    console.log("======" + "TARGET" + "======");

    // Standard
    if (tx) {
        console.log("Standard: " + chalk.green(url_target_playstation_stan));
        report.target_ps_stan = url_target_playstation_stan;
        consoleAvailable = true;
    } else {
        console.log("Standard: " + chalk.red(tx));
    }

    // Digital
    if (ty) {
        console.log("Digital: " + chalk.green(url_target_playstation_stan));
        report.target_ps_stan = url_target_playstation_stan;
        consoleAvailable = true;
    } else {
        console.log("Digital: " + chalk.red(ty));
    }
    console.log("==================");

    // Log Report object
    console.log(report);

    // Amazon
    // report.playstation.amazon.stan = await getAmazon_PS5(url_amazon_playstation_stan)
    // console.log(report);

    // Send email results if a console was found
    // if (consoleAvailable) { sendEmail(report); }

    // // Close the browser session
    await browser.close()


    console.log("Sleeping...");
    const timer = await setTimeout(() => {
        console.log("Slept for 10");
        getAvailability()
    }, 10000);

}


// ---------------------------------------------------
//                  Email Function
// ---------------------------------------------------
const sendEmail = (report) => {


    // Convert object into array and filter to only the results that matter
    const array = Object.entries(report).filter(([key, value]) => { return value != false })
    let string_list = ""
    array.forEach(element => {
        string_list += `<li>${element[0]}: ${element[1]}</li>\n`
    });

    console.log(string_list)


    let body_html = `
        <h1>Please review the below links!</h1>
        <ul>
        ${string_list}
        </ul>
    `

    // Auth
    const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    })

    // Options
    const options = {
        from: process.env.USER,
        to: process.env.TO,
        subject: "CONSOLE ALERT!!!! Check the links below immediately!",
        html: body_html
    };

    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Sent: " + info.response);
    })


}




// Init
getAvailability()
