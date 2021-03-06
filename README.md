# Fast Fast Series

Run as fast as possible your functions

## Install

```bash
npm i --save fast-fast-series
```

## Usage

```js
const ffs = require('fast-fast-series')

function func1 (obj, next) {
  obj.a += 1
  setTimeout(next, 0, null, obj)
}

function func2 (obj, next) {
  obj.b = 6
  setTimeout(next, 2, null, obj)
}

function func3 (obj, next) {
  obj.c = 77
  setTimeout(next, 0, null, obj)
}

const f = ffs([
  func1,
  func2,
  func3,
  function (arg) {
    // ok
    console.log(arg)
  }
], function (err) {
  // error case
  console.log(err)
})

f({ a: 3 })
```

Output:

```
{ a: 4, b: 6, c: 77 }
```

## License

Licensed under [MIT](./LICENSE).
