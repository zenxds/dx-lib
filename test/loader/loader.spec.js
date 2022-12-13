import loadScript from '../../src/loader/loadScript'

xtest('loadScript', async () => {
  await loadScript('https://g.alicdn.com/kissy/k/6.2.4/seed-min.js', {
    hour: true
  })

  await request
  const data = {
    state: request._state,
    hasKissy: !!window.KISSY
  }

  console.log(data)
  expect(data.state === 2).toBeTruthy()
  expect(data.hasKissy).toBeTruthy()
})

function sleep(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}