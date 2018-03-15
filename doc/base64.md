# base64

## how to use

```
import { encode, decode } from 'dx-lib/lib/base64'

// 中文字符串会按UTF8进行编解码
decode(encode('字符串'))
```

```
// 自定义base64字符串顺序
const code = 'S0DOZN9bBJyPV-qczRa3oYvhGlUMrdjW7m2CkE5_FuKiTQXnwe6pg8fs4HAtIL1x='
decode(encode('字符串', code), code)
```
