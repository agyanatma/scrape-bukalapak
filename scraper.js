const puppeteer = require("puppeteer");
const xlsx = require("xlsx");

/**
 * container classname zc7KVe
 * nama classname X43Kjb
 * tanggal classname p2TkOb
 * bintang classname pf5lIe > div first child aria label
 * komentar classname bN97Pc
 * **/

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("http://localhost:3001/");

    let scrapedData = [];
    const wrapper = await page.$$("div.d15Mdf");

    for (let i = 0; i < wrapper.length; i++) {
        const komentar = await wrapper[i].$eval(
            ".UD7Dzf > span:first-child",
            (el) => el.textContent
        );
        const rating = await wrapper[i].$eval(".pf5lIe > div", (el) => {
            const value = el.getAttribute("aria-label");
            return value.replace("Diberi rating ", "");
        });
        const nama = await wrapper[i].$eval("span.X43Kjb", (el) => el.textContent);
        const tanggal = await wrapper[i].$eval(".p2TkOb", (el) => {
            const bulan = [
                "Januari",
                "Febuari",
                "Maret",
                "April",
                "Mei",
                "Juni",
                "Juli",
                "Agustus",
                "September",
                "Oktober",
                "November",
                "Desember",
            ];
            const value = el.textContent;
            const arr = value.split(" ");
            const y = Number(arr[2]);
            const m = Number(bulan.indexOf(arr[1]));
            const d = Number(arr[0]);

            return new Date(y, m, d).toISOString();
        });

        scrapedData.push({
            Nama: nama,
            Tanggal: tanggal,
            Rating: rating,
            Komentar: komentar,
        });
    }

    // console.log(scrapedData);

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(
        scrapedData.sort((a, b) => new Date(b.Tanggal) - new Date(a.Tanggal))
    );
    xlsx.utils.book_append_sheet(wb, ws);
    xlsx.writeFile(wb, "reviews.xlsx");

    await browser.close();
})();
