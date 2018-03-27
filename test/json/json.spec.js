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

test('json', async t => {
  const { page } = t.context
  await page.goto(`http://127.0.0.1:${testPort}/test/json/index.html`)

  const data = await page.evaluate(() => {
    return parseJSON('{"a": "a", "b": "b"}')
  })

  t.deepEqual(data, { a: "a", b: "b" })

  let strs = await page.evaluate(() => {
    return {
      str1: stringifyJSON({ a: "a", b: "b" }),
      str2: stringifyJSON({ a: "a", b: "b" }, null, 4),
      str3: stringifyJSON({ a: "a", b: "b" }, null, '@')
    }
  })
  t.is(strs.str1, '{"a":"a","b":"b"}')
})