const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://www.law.go.kr/LSW//lsInfoP.do?lsiSeq=280187&chrClsCd=010202&urlMode=lsInfoP&efYd=20251201&ancYnChk=0', { waitUntil: 'networkidle0' });
  
  // Need to extract articles: 69, 142, 38, 332, 200
  // Note: scraping might be complex depending on DOM. Let's get the entire text of the body iframe to identify text.
  const iframeElement = await page.$('#lawService');
  const iframe = await iframeElement.contentFrame();
  const bodyText = await iframe.evaluate(() => document.body.innerText);
  console.log(bodyText.substring(0, 500)); // Log part to check structure
  await browser.close();
})();
