'use strict'

const t = require('tap')
const ffi = require('./index')

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

function func4 (obj, next) {
  obj.d = this.gg
  setTimeout(next, 0, null, obj)
}

function fail (obj, next) {
  setTimeout(next, 0, new Error('Error'), obj)
}

t.test('one', t => {
  t.plan(2)

  const obj = { a: 2 }

  const f = ffi([
    func1,
    func2,
    func3,
    function (arg) {
      t.deepEqual(arg, {
        a: 3,
        b: 6,
        c: 77
      })
      t.equal(obj, arg)
    }
  ])

  f(obj)
})

t.test('twice', t => {
  t.plan(2)

  const f = ffi([
    func1,
    func2,
    func3,
    function (arg) {
      t.deepEqual(arg, {
        a: 3,
        b: 6,
        c: 77
      })
    }
  ])

  f({ a: 2 })
  f({ a: 2 })
})

t.test('error', t => {
  t.plan(2)

  const f = ffi([
    func1,
    fail,
    func3,
    function (arg) {
      t.fail()
    }
  ], function (err, obj) {
    t.equal(err.message, 'Error')
    t.deepEqual(obj, {
      a: 3
    })
  })

  f({ a: 2 })
})

t.test('this context', t => {
  t.plan(2)

  const obj = { a: 2 }
  const self = { gg: 9 }

  const f = ffi([
    func1,
    func4.bind(self),
    func3,
    function (arg) {
      t.deepEqual(arg, {
        a: 3,
        c: 77,
        d: 9
      })
      t.equal(obj, arg)
    }
  ])

  f(obj)
})
