# jsonp

## how to use

```
import jsonp from 'dx-lib/lib/jsonp'

jsonp({
  url: '',
  data: {},
  callback: 'callback',
  timeout: 30 * 1000
}).then(resp => {

}).catch(err => {

})
```