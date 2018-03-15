import test from 'ava'
import Promise from '../../lib/Promise'

const PENDING = 0
const FULFILLED = 1
const REJECTED = 2

test('should call then more than once', async t => {
  const promise = new Promise(function(resolve, reject) {
    resolve(1)
  })

  await promise.then(function(result) {
    t.is(result, 1)
  })

  await promise.then(function(result) {
    t.is(result, 1)
  })

  t.pass()
})

test('should pass the result to next promise', async t => {
  const interval = 50
  
  const fun1 = function() {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(1)
      }, interval)
    })
  }

  const fun2 = function(val) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(1 + val)
      }, interval)
    })
  }

  const fun3 = function(val) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(val * 2)
      }, interval)
    })
  }

  const output = await fun1().then(fun2).then(fun3)
  t.is(output, 4)
})

test('should be ignore if the onFulfilled or onRejected is not a function', async t => {
  const p1 = new Promise(function(resolve) {
    resolve(1)
  })
  const p2 = p1.then(null, 5)
  
  t.is(await p2, 1)
})

test('should call the thenable', async t => {
  let p1 = Promise.resolve(1)
  let p2 = p1.then(function() {
    return {
      then: function(resolve, reject) {
        resolve(2)
      }
    }
  })

  t.is(await p2, 2)

  p2 = p1.then(function() {
    return {
      then: function(resolve, reject) {
        reject(2)
      }
    }
  })

  try {
    await p2
  } catch(err) {
    t.is(err, 2)
  }

  p2 = p1.then(function() {
    return {
      then: function(resolve, reject) {
        a.b.c()
      }
    }
  })

  try {
    await p2
  } catch(err) {
    t.truthy(err)
  }
})

test('should catch the err', async t => {
  const p1 = Promise.resolve(1)
  const p2 = p1.then(function() {
    a.b.c()
  })

  try {
    await p2
  } catch(err) {
    t.is(p2._state, REJECTED)
  }
})

test('should reject if the resolve value is promise self', async t => {
  const p1 = Promise.resolve()
  const p2 = p1.then(function() {
    return p2
  })

  try {
    await p2
  } catch(err) {
    t.truthy(p2._reason instanceof TypeError)
  }
})

test("should tell is pending", t => {
  const p = new Promise(function(resolve, reject) {})
  t.truthy(p.isPending())
  t.falsy(p.isFulfilled())
  t.falsy(p.isRejected())
})

test("should tell is fulfilled", t => {
  const p = new Promise(function(resolve, reject) {
    resolve()
  })

  t.falsy(p.isPending())
  t.truthy(p.isFulfilled())
  t.falsy(p.isRejected())

  p.resolve()
  t.truthy(p.isFulfilled())
})

test("should tell is rejected", t => {
  const p = new Promise(function(resolve, reject) {
    reject()
  })
  t.falsy(p.isPending())
  t.falsy(p.isFulfilled())
  t.truthy(p.isRejected())
})

test.cb("should finally call the handler", t => {
  let counter = 0
  let handler = function(val) {
    counter++
  }

  let p = Promise.resolve(1)
  p.finally(handler)

  p = Promise.reject(1)
  p.finally(handler)

  setTimeout(function() {
    t.is(counter, 2)
    t.end()
  }, 10)
})

test.cb("should catch the error finally", t => {
  let err = new Error()
  let fun1 = function() {
    return new Promise(function(resolve, reject) {
      reject(err)
    })
  }

  let fun2 = function() {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(1)
      }, interval)
    })
  }

  let fun3 = function() {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(2)
      }, interval)
    })
  }

  fun1()
    .then(fun2)
    .then(fun3)
    ["catch"](function(e) {
      t.is(e, err)
      t.end()
    })
})

test.cb("should get the result after the promises resolve", t => {
  const promises = [1, 2, 3].map(function(i) {
    return new Promise(function(resolve) {
      resolve(i * i)
    })
  })

  Promise.all(promises).then(function(result) {
    t.deepEqual(result, [1, 4, 9])
    t.deepEqual(
      promises.map(function(item) {
        return item._state
      })
    , [1, 1, 1])

    t.end()
  })
})

test.cb("should execute in order", t => {
  const result = []
  const p1 = new Promise(function(resolve) {
    setTimeout(function() {
      result.push(1)
      resolve()
    }, 100)
  })
  
  const p2 = new Promise(function(resolve) {
    result.push(2)
    resolve()
  })
  const p3 = new Promise(function(resolve) {
    setTimeout(function() {
      result.push(3)
      resolve()
    }, 300)
  })

  Promise.all([p1, p2, p3]).then(function() {
    t.deepEqual(result, [2, 1, 3])
    t.end()
  })
})

test.cb("should get the error if some throw error", t => {
  const promises = [3, 2, 1].map(function(i) {
    return new Promise(function(resolve, reject) {
      reject(i * i)
    })
  })

  Promise.all(promises).catch(function(result) {
    t.is(result, 9)
    t.end()
  })
})

test.cb("should rece the promises", t => {
  const promises = [1, 2, 3].map(function(i) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(i * i)
      }, 100 * i)
    })
  })

  Promise.race([Promise.reject(1), Promise.resolve(2)]).then(null, function(
    err
  ) {
    t.is(err, 1)
  })

  Promise.race(promises).then(function(result) {
    t.is(result, 1)
    t.end()
  })
})

test("should reject a value to promise", t => {
  const promise = Promise.reject(new Error())
  t.truthy(promise instanceof Promise)
})

test("should resolve a value to promise", t => {
  const promise = Promise.resolve()
  t.truthy(promise instanceof Promise)
})

test('defer', t => {
  const defer = Promise.defer()

  t.truthy(defer.resolve instanceof Function)
  t.truthy(defer.reject instanceof Function)
  t.truthy(defer.promise instanceof Promise)
})