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





// GAMESTOP - Digital & Standard Edition
const getGameStop_PS5 = async (url) => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36')
        await page.goto(url)

        await page.waitForSelector('#add-to-cart');
        await page.screenshot({ path: 'gamestop_digital.png' });

        const obj = await page.evaluate('document.querySelector("#add-to-cart").getAttribute("data-gtmdata")')
        const avail = JSON.parse(obj).productInfo.availability
        console.log(avail);

        await browser.close()

        return avail
    } catch (e) {
        console.log('Error', e);
    }
}




const getAvailability = async () => {
    report.playstation.gamestop.dig = await getGameStop_PS5(url_gameStop_playstation_dig)
    report.playstation.gamestop.stan = await getGameStop_PS5(url_gameStop_playstation_stan)

    console.log(report);
}

getAvailability();