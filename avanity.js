const { createCursor } = require('ghost-cursor-playwright')
const cluster = require('cluster')
const { firefox } = require('playwright')
const prompt = require('prompt-sync')({ sigint: true })
const {default: axios} = require("axios");
const fs = require("fs");
const playwright = require("playwright");

var created = 0;
var accounts = fs.createWriteStream('accounts.txt', {
    flags: 'a'
  })

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

process.title = 'Avanity | Accounts Created: '+created;

Intro = 
` 
▄▄▄    ██▒   █▓ ▄▄▄       ███▄    █  ██▓▄▄▄█████▓▓██   ██▓
▒████▄ ▓██░   █▒▒████▄     ██ ▀█   █ ▓██▒▓  ██▒ ▓▒ ▒██  ██▒
▒██  ▀█▄▓██  █▒░▒██  ▀█▄  ▓██  ▀█ ██▒▒██▒▒ ▓██░ ▒░  ▒██ ██░
░██▄▄▄▄██▒██ █░░░██▄▄▄▄██ ▓██▒  ▐▌██▒░██░░ ▓██▓ ░   ░ ▐██▓░
 ▓█   ▓██▒▒▀█░   ▓█   ▓██▒▒██░   ▓██░░██░  ▒██▒ ░   ░ ██▒▓░
 ▒▒   ▓▒█░░ ▐░   ▒▒   ▓▒█░░ ▒░   ▒ ▒ ░▓    ▒ ░░      ██▒▒▒ 
  ▒   ▒▒ ░░ ░░    ▒   ▒▒ ░░ ░░   ░ ▒░ ▒ ░    ░     ▓██ ░▒░ 
  ░   ▒     ░░    ░   ▒      ░   ░ ░  ▒ ░  ░       ▒ ▒ ░░  
      ░  ░   ░        ░  ░         ░  ░            ░ ░     
            ░                                      ░ ░     
                  https://avanity.cc
`

;(async () => {
    if(cluster.isMaster) {
        console.clear()
        console.log('\x1b[35m%s\x1b[0m', (Intro));
        var threads = parseInt(prompt('\x1b[35mAvanity | Threads -> \x1b[0m'))
        for (var i = 0; i < threads; i++) {
            cluster.fork()
        }
    } else {
        await avanity()
    }

})()

async function avanity() {
    const browser = await playwright.firefox.launch({headless: true});
    const context = await browser.newContext();
    const page = await context.newPage();
    const cursor = await createCursor(page);

    var email = Math.random().toString(4).substring(2, 12);
    email += "@avanity.cc";
    var username = 'Avanity' + Math.random().toString(4).substring(2, 12);
    var password = 'Avanity1337!'


    await page.goto('https://playvalorant.com/de-de/');
    await page.click('text=Accept all');
    await page.click('[data-testid="riotbar:account:button-play-now"]');
    await Promise.all([
      page.waitForNavigation(/*{ url: 'https://auth.riotgames.com/login#client_id=play-valorant-web-prod&nonce=MTM2LDUwLDY4LDIz&prompt=signup&redirect_uri=https%3A%2F%2Fplayvalorant.com%2Fopt_in%2F%3Fredirect%3D%2Fdownload%2F&response_type=token%20id_token&scope=account%20openid&state=c2lnbnVw&ui_locales=de' }*/),
      page.click('[data-testid="homepage-signupModal-button-signup"]')
    ]);
    await page.fill('[data-testid="input-email"]', email);
    console.log('\x1b[35mAvanity | Email > ' + email)
    await page.click('[data-testid="btn-signup-submit"]');
    await page.fill('[data-testid="input-birthday-day"]', '01');
    await page.fill('[data-testid="input-birthday-month"]', '01');
    await page.fill('[data-testid="input-birthday-year"]', '1990');
    await page.click('[data-testid="btn-signup-submit"]');
    await page.fill('[data-testid="input-username"]', username);
    console.log('\x1b[35mAvanity | Password > ' + password)
    console.log('\x1b[35mAvanity | Username > ' + username)
    await page.click('[data-testid="btn-signup-submit"]');
    await page.fill('[data-testid="input-password"]', password);
    await page.fill('[data-testid="input-confirm-password"]', password);
    await page.click('[data-testid="btn-signup-submit"]');
    console.log('\x1b[35mAvanity | Captcha bypassed!')
    await sleep(1000)
    console.log('\x1b[35mAvanity | Created > ' + email + ':' + password + ':' + username)
    process.send({ created: "+1" })
    accounts.write(email + ':' + password + ':' + username + '\n')
    await browser.close
        await avanity()
}