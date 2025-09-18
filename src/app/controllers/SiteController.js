const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function clickCloseButton(page) {
    try {
        const result = await page.evaluate(() => {
            const btn = document.querySelector('[aria-label="Close"]');
            if (btn) {
                btn.click();
                return 'Đã click close';
            }
            return 'Không tìm thấy close';
        });
        console.log(result);
    } catch (err) {
        console.log('Không tìm thấy nút Close:', err.message);
    }
}

// Hàm tải ảnh về server
async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https
            .get(url, (res) => {
                const fileStream = fs.createWriteStream(filepath);
                res.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    resolve();
                });
            })
            .on('error', (err) => reject(err));
    });
}

class SiteController {
    async home(req, res) {
        console.log('home');
        res.render('home');
    }

    async down(req, res) {
        const { links } = req.body;
        if (!Array.isArray(links) || links.length === 0) {
            return res.status(400).json({ error: 'Thiếu link' });
        }

        const results = [];

        try {
            const browser = await puppeteer.launch({
                headless: false,
                defaultViewport: null,
                args: ['--start-maximized'],
            });

            for (let link of links) {
                const page = await browser.newPage();
                await page.goto(link, { waitUntil: 'networkidle2' });
                await delay(2000);

                await page.waitForSelector('img');
                const imageUrl = await page.$eval('img', (img) => img.src);

                const saveDir = path.join(__dirname, '../downloads');
                if (!fs.existsSync(saveDir)) {
                    fs.mkdirSync(saveDir, { recursive: true });
                }

                const fileName = `downloaded_${Date.now()}.jpg`;
                const filePath = path.join(saveDir, fileName);
                await downloadImage(imageUrl, filePath);

                results.push(`/downloads/${fileName}`);

                await page.close();
            }

            await browser.close();

            res.json({ message: 'Tải ảnh thành công', files: results });
        } catch (err) {
            console.error('Chi tiết lỗi:', err);
            res.status(500).json({ error: 'Lỗi khi tải ảnh' });
        }
    }
}

module.exports = new SiteController();
