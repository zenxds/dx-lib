import test from 'ava'
import { param, unparam } from '../../lib/param'

test('param & unparm', t => {
  t.is(param({
    key1: 'a',
    key2: 'a.b',
    key3: 123
  }), 'key1=a&key2=a.b&key3=123')
  
  t.deepEqual({
    key1: 'a',
    key2: 'a.b',
    key3: '123'
  }, unparam('key1=a&key2=a.b&key3=123'))
})

test('param & unparm array', t => {
  t.is(param({
    arr: ['a', 'b'],
    key: 'val' 
  }), 'arr%5B%5D=a&arr%5B%5D=b&key=val')
  
  t.deepEqual({
    arr: ['a', 'b'],
    key: 'val'
  }, unparam('arr%5B%5D=a&arr%5B%5D=b&key=val'))
})

