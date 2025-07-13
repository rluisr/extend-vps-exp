import puppeteer from 'puppeteer'
import { setTimeout } from 'node:timers/promises'
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder'

const browser = await puppeteer.launch({
    defaultViewport: {width: 1080, height: 1024},
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
const [page] = await browser.pages()
const recorder = new PuppeteerScreenRecorder(page)
await recorder.start('recording.mp4')

try {
    await page.goto('https://secure.xserver.ne.jp/xapanel/login/xserver/')
    await page.locator('#memberid').fill(process.env.EMAIL)
    await page.locator('#user_password').fill(process.env.PASSWORD)
    await page.click('text=ログインする')
    await page.waitForNavigation()
    await page.goto('https://secure.xserver.ne.jp/xapanel/xvps/index')
    await page.click('.contract__menuIcon')
    await page.click('text=契約情報')
    await page.click('text=更新する')
    await page.click('text=引き続き無料VPSの利用を継続する')
    await page.waitForNavigation()
    await page.click('text=無料VPSの利用を継続する')
} catch (e) {
    console.error(e)
} finally {
    await setTimeout(2000)
    await recorder.stop()
    await browser.close()
}
