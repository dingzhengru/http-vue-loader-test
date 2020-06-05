# http-vue-loader-test
測試 http-vue-loader


```
npm -i
npm start
```

## 注意點
* component 標籤的命名必須是小寫搭配 "-"，ex: ```{ 'my-component': './TestComponent' }```
* export default {} 要改成 module.exports = {}
* import 語法無法使用，css, js 改用 link & script， 其他就用 get 請求取代 (axios, jquery)  