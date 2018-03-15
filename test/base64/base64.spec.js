import test from 'ava'
import { encode, decode } from '../../lib/base64'


test('should encode to the right pattern', t => {
  let str = "abcd"
  t.truthy(/[A-Za-z\+\=\/]+/.test(encode(str)))
})

test('should encode to the right length', t => {
  t.is(encode("a").length, 4)
  t.is(encode("ab").length, 4)
  t.is(encode("abc").length, 4)
  t.is(encode("abcd").length, 8)
  t.is(encode("a").length, 4)
})

test('should encode and decode 1 byte string', t => {
  let str = "abcd"
  t.is(str, decode(encode(str)))
})

test('should encode and decode 2 bytes string', t => {
  let str = "̢̡"
  t.is(str, decode(encode(str)))
})

test('should encode and decode 3 bytes string', t => {
  let str = "这是个中文字符串"
  t.is(str, decode(encode(str)))
})

test('should encode and decode another base64str', t => {
  let code = 'S0DOZN9bBJyPV-qczRa3oYvhGlUMrdjW7m2CkE5_FuKiTQXnwe6pg8fs4HAtIL1x='
  let str

  str = "abcd"
  t.is(encode(str), 'YWJjZA==')  
  t.is(str, decode(encode(str)))

  str = "̢̡"
  t.is(str, decode(encode(str)))

  str = "这是个中文字符串"
  t.is(str, decode(encode(str)))
})