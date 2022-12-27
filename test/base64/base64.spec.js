import { encode, decode } from '../../src/base64'

test('should encode to the right pattern', () => {
  let str = "abcd"
  expect(/[A-Za-z\+\=\/]+/.test(encode(str))).toBeTruthy()
})

test('should encode to the right length', () => {
  expect(encode("a").length).toBe(4)
  expect(encode("ab").length).toBe(4)
  expect(encode("abc").length).toBe(4)
  expect(encode("abcd").length).toBe(8)
  expect(encode("a").length).toBe(4)
})

test('should encode and decode 1 byte string', () => {
  let str = "abcd"
  expect(str).toBe(decode(encode(str)))
})

test('should encode and decode 2 bytes string', () => {
  let str = "̢̡"
  expect(str).toBe(decode(encode(str)))
})

test('should encode and decode 3 bytes string', () => {
  let str = "这是个中文字符串"
  expect(str).toBe(decode(encode(str)))
})

test('should encode and decode another base64str', () => {
  let code = 'S0DOZN9bBJyPV-qczRa3oYvhGlUMrdjW7m2CkE5_FuKiTQXnwe6pg8fs4HAtIL1x='
  let str

  str = "abcd"
  expect(encode(str)).toBe('YWJjZA==')
  expect(str).toBe(decode(encode(str)))

  str = "̢̡"
  expect(str).toBe(decode(encode(str)))

  str = "这是个中文字符串"
  expect(str).toBe(decode(encode(str)))
})