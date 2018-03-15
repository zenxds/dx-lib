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

test('ajax', async t => {
  const { page } = t.context
  await page.goto(`http://127.0.0.1:${testPort}/test/ajax/index.html`)
  await sleep(500)
  
  const state = await page.evaluate(() => {
    return request._state
  })

  t.truthy(state === 2)

  const pkg = await page.evaluate(() => {
    return request2
  })

  t.is(pkg.name, 'dx-lib')
})

function sleep(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}