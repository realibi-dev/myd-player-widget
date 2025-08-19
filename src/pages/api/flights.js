const puppeteer = require('puppeteer');

export default async function (req, res) {
  if (req.method === 'GET') {
    try {
      console.log('Загрузка сегодняшних рейсов...');

      const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/chromium-browser',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--disable-gpu'
        ]
      });

      const page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      await page.goto('https://dmb.aero/flights/online-flights/', {
        waitUntil: 'networkidle2',
        timeout: 15000,
      });

      // Ждём, пока появится секция "Сегодня"
      await page.waitForSelector('.today', {timeout: 10000});

      // Извлекаем только рейсы из блока "Сегодня"
      const todayFlights = await page.evaluate(() => {
        const todayBlock = document.querySelector('.today');
        if (!todayBlock) return [];

        const blocks = todayBlock.querySelectorAll('#r-block');
        return Array.from(blocks).map(block => ({
          flight: block.querySelector('.r-Reis')?.textContent.trim() || '',
          destination: block.querySelector('.r-Napravl')?.textContent.trim() || '',
          airline: block.querySelector('.r-Aviacompany')?.textContent.trim() || '',
          status: block.querySelector('.r-Status')?.textContent.trim() || '',
          time: block.querySelector('.r-Time')?.textContent.trim().replace(/\s+/g, ' ') || ''
        }));
      });

      await browser.close();

      console.log(`Найдено ${todayFlights.length} сегодняшних рейсов`);

      res.json({
        success: true,
        data: todayFlights,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}
