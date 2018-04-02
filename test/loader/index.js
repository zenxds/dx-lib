import puppeteer from 'puppeteer'
import test from 'ava'

const { testPort } = require('../../package.json')

test.beforeEach(async t => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()

  t.context.browser = page
  t.context.page = page
})

test.afterEach(async t => {
  t.context.browser.close()
})

test('loadScript', async t => {
  const { page } = t.context
  await page.goto(`http://127.0.0.1:${testPort}/test/loader/index.html`)
  await sleep(3000)
  
  const data = await page.evaluate(() => {
    return {
      state: request._state,
      hasKissy: !!window.KISSY
    }
  })

  t.truthy(data.state === 1)
  t.true(data.hasKissy)
})

function sleep(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}