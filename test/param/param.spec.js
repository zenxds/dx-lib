import { param, unparam } from '../../src/param'

test('param & unparm', () => {
  expect(
    param({
      key1: 'a',
      key2: 'a.b',
      key3: 123
    })
  ).toEqual('key1=a&key2=a.b&key3=123')

  expect({
    key1: 'a',
    key2: 'a.b',
    key3: '123'
  }).toEqual(unparam('key1=a&key2=a.b&key3=123'))
})

test('param & unparm array', () => {
  expect(
    param({
      arr: ['a', 'b'],
      key: 'val'
    })
  ).toEqual('arr%5B%5D=a&arr%5B%5D=b&key=val')

  expect({
    arr: ['a', 'b'],
    key: 'val'
  }).toEqual(unparam('arr%5B%5D=a&arr%5B%5D=b&key=val'))
})
