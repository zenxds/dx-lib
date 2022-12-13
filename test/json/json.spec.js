import { parseJSON, stringifyJSON } from '../../src/json'

test('json', async () => {
  expect(parseJSON('{"a": "a", "b": "b"}')).toEqual({ a: "a", b: "b" })

  let strs = {
    str1: stringifyJSON({ a: "a", b: "b" }),
    str2: stringifyJSON({ a: "a", b: "b" }, null, 4),
    str3: stringifyJSON({ a: "a", b: "b" }, null, '@')
  }
  expect(strs.str1).toEqual('{"a":"a","b":"b"}')
})