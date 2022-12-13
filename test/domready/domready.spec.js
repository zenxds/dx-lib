
import domready from '../../src/domready'

test('domready', async () => {
  await domready
  expect(domready._state).toBe(1)
})