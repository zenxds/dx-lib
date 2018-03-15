# param

## how to use

```
import { param, unparam } from 'dx-lib/lib/param'

param({ foo: 1, bar: 2 }) // => foo=1&bar=2
param({ foo: 1, bar: [2, 3] }) // => foo=1&bar%5B%5D=2&bar%5B%5D=3
param({ foo: 1, bar: [2, 3] }, '&', '=', false) // => foo=1&bar=2&bar=3
param({ foo: '', bar: 2 }) // => foo=&bar=2
param({ foo: undefined, bar: 2 }) // => foo&bar=2

unparam('foo=1&bar=2') // => { foo: 1, bar: 2 }
unparam('foo=1&bar=2&bar=3') // => { foo: 1, bar: [2, 3] }
unparam('foo=1&bar%5B%5D=2&bar%5B%5D=3') // => { foo: 1, bar: [2, 3] }
```