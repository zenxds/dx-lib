import * as cookie from '../../src/cookie'

test('cookie', () => {
  expect(cookie.get('test_cookie')).toBe(undefined)

  cookie.set('test_cookie', 'test_value')
  expect(cookie.get('test_cookie')).toBe('test_value')
  
  cookie.remove('test_cookie')
  expect(cookie.get('test_cookie')).toBe(undefined)
})