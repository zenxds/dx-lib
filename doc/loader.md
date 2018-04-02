# loadScript

## how to use

```
import { loadScript } from 'dx-lib/lib/loader'

jsonp('https://g.alicdn.com/kissy/k/6.2.4/seed-min.js').then(() => {
  console.log('script onload)
}).catch(err => {

})
```