const puppeteer = require('puppeteer');
let page;
async function getBrowserPage() {
  // Launch headless Chrome. Turn off sandbox so Chrome can run under root.
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  return browser.newPage();
}
const insta = async () => {
  if (!page) {
    page = await getBrowserPage();
  }
  await page.goto('https://www.instagram.com/kokookuda/');
  return page.evaluate(getJson);
};

function getJson() {
  return [...document.querySelectorAll('#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(-n+3) a')].map(a => {
    const img = a.querySelector("img")
    return {href: a.href, src: img.src, srcset: img.srcset}
  });
}

exports.handler = async(event, context, callback)=> {
  callback(null, {
    statusCode: 200,
    body: await insta()
  });
}

//exports.handler(null, null, (_,res)=>console.log(res.body));

