# Promise

Promise实现

## how to use

```
import Promise from 'dx-lib/lib/Promise'

const p = Promise.resolve(5)

p.then()
p.catch()
p.finally()
p.isPending()
p.isFulfilled()
p.isRejected()

Promise.all
Promise.race
Promise.resolve
Promise.reject
Promise.defer
```