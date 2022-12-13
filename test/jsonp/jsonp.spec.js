import jsonp from '../../src/jsonp'

test('jsonp', async () => {
  const request = jsonp({
    url: 'https://constid.dingxiang-inc.com/udid/c1',
    data: {
      a: 'a',
      b: 'b'
    },
    timeout: 300
  })

  await sleep(500)
  // 不是真实环境，无法回调？
  expect(request._state).toEqual(2)
})

function sleep(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}