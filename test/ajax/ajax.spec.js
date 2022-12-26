import ajax from '../../src/ajax'

test('ajax error', async () => {
  const request = ajax({
    url: '/aaa',
    method: 'post',
    headers: {
      'x-token': 'token'
    },
    data: {
      a: 'a',
      b: 'b'
    },
    timeout: 300
  })
  
  try {
    await request
  } catch(err) {}

  expect(request._state).toBe(2)
})

test('ajax success', async () => {
  const request = ajax({
    url: 'https://cdn.dingxiang-inc.com/index.html',
    dataType: 'text',
    timeout: 300
  })
  
  const response = await request

  expect(response.status).toBe(200)
  expect(response.headers.contentType).toBe('text/html')
  expect(request._state).toBe(1)
})