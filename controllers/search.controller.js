const { BaseError, BadRequestError } = require('../lib/errors');
const puppeteer = require('puppeteer');

exports.crawlPlantNames = async (req, res, next) => {
  try {
    const keyword = req.query.keyword;

    if (!keyword.length) {
      next(new BadRequestError('검색어를 입력해주세요'));
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const searchUrl = 'https://www.treeinfo.net/plant/list.php';

    await page.goto(searchUrl);
    await page.type('input#search', keyword);
    await page.type('input#search', String.fromCharCode(13));
    await page.waitForSelector('table .list_tr', { timeout: 10000 });

    const data = await page.evaluate(() => {
      const contents = Array.from(
        document.querySelectorAll('table .list_tr .list-subject > a'),
      );
      const results = [];

      contents.forEach((result) => {
        const title = result.innerText;
        const link = result.href;

        results.push({ title, link });
      });

      return results;
    });

    await browser.close();

    return res.status(201).json({ data });
  } catch (err) {
    return next(new BaseError());
  }
};

exports.crawlPlantInfo = async (req, res, next) => {
  try {
    const { number } = req.params;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const scrapUrl = `https://www.treeinfo.net/plant/view.php?ti_no=${number}`;
    const plantInfo = {};

    await page.goto(scrapUrl);
    await page.waitForSelector('div#div_gardening div', { timeout: 10000 });

    const data = await page.evaluate(() => {
      const contents = Array.from(
        document.querySelectorAll('div#div_gardening div'),
      );
      const results = [];

      contents.forEach((content) => {
        const info = content.innerText.trim().split('\n')[1];

        results.push(info);
      });

      return results;
    });

    if (data[0].includes('양지')) {
      plantInfo.isSun = true;
    } else {
      plantInfo.inSun = false;
    }

    if (data[1].includes('5')) {
      plantInfo.watering = 5;
    } else if (data[1].inCludes('3')) {
      plantInfo.watering = 3;
    } else {
      plantInfo.watering = 1;
    }

    await browser.close();

    return res.status(201).json({ plantInfo });
  } catch {
    return next(new BaseError());
  }
};
