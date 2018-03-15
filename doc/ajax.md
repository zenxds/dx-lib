# ajax

## how to use

```
import ajax from 'dx-lib/lib/ajax'

ajax({
  method: 'GET',  
  url: '',
  data: {},
  headers: {},
  dataType: 'json',
  timeout: 30 * 1000,
  async: true,
  cache: true,
  credentials: false
}).then(resp => {

}).catch(err => {

})
```