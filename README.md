# dx-lib

dx lib 

## install

```
yarn add dx-lib --save
```

## modules

* [ajax](doc/ajax.md)
* [jsonp](doc/jsonp.md)
* [loader](doc/loader.md)
* [domready](doc/domready.md)
* [cookie](doc/cookie.md)
* [param](doc/param.md)
* [base64](doc/base64.md)
* [json](doc/json.md)
* [Promise](doc/Promise.md)
* [Events](doc/Events.md)

## .babelrc

不加入到提交，因为会影响引用时的打包

```
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "browsers": ["last 2 versions", "safari >= 7"],
        "node": true
      }
    }]
  ],
  "plugins": []
}
```

## 版本说明

* 0.4开始，默认使用全局的JSON、Promise，不再使用内置的对应实现