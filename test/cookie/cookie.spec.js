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

test('cookie', async t => {
  const { page } = t.context
  await page.goto(`http://127.0.0.1:${testPort}/test/cookie/index.html`)

  let v

  v = await page.evaluate(() => {
    return cookie.get('test_cookie')
  })
  t.truthy(v === undefined)

  v = await page.evaluate(() => {
    cookie.set('test_cookie', 'test_value')
    return cookie.get('test_cookie')
  })
  t.truthy(v === 'test_value')

  v = await page.evaluate(() => {
    cookie.remove('test_cookie')
    return cookie.get('test_cookie')
  })
  t.truthy(v === undefined)
})