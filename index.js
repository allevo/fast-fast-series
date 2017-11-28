'use strict'

function handle (err, obj) {
  if (err) {
    return this.errorCallback(err, obj)
  }
  if (this.f[this.i]) {
    this.f[this.i].current(obj, this.f[this.i].next)
  }
}

function exec (context) {
  this.f.current(context, this.f.next)
}

module.exports = function fastFastIterator (functions, errorCallback) {
  const f = []
  for (var i = 0; i < functions.length - 1; i++) {
    f.push({
      current: functions[i],
      next: handle.bind({ errorCallback, f, i: i + 1 })
    })
  }

  f.push({
    current: functions[i],
    next: handle.bind({ errorCallback, f, i: i + 1 })
  })

  return exec.bind({ f: f[0] })
}
