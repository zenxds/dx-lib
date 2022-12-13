import Promise from '../../src/Promise'

const PENDING = 0
const FULFILLED = 1
const REJECTED = 2

test('should call then more than once', async () => {
  const promise = new Promise(function(resolve, reject) {
    resolve(1)
  })

  await promise.then(function(result) {
    expect(result).toBe(1)
  })

  await promise.then(function(result) {
    expect(result).toBe(1)
  })
})

test('should pass the result to next promise', async () => {
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
  expect(output).toBe(4)
})

test('should be ignore if the onFulfilled or onRejected is not a function', async () => {
  const p1 = new Promise(function(resolve) {
    resolve(1)
  })
  const p2 = p1.then(null, 5)
  
  expect(await p2).toBe(1)
})

test('should call the thenable', async () => {
  let p1 = Promise.resolve(1)
  let p2 = p1.then(function() {
    return {
      then: function(resolve, reject) {
        resolve(2)
      }
    }
  })

  expect(await p2).toBe(2)

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
    expect(err).toBe(2)
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
    expect(err).toBeTruthy()
  }
})

test('should catch the err', async () => {
  const p1 = Promise.resolve(1)
  const p2 = p1.then(function() {
    a.b.c()
  })

  try {
    await p2
  } catch(err) {
    expect(p2._state).toEqual(REJECTED)
  }
})

test('should reject if the resolve value is promise self', async () => {
  const p1 = Promise.resolve()
  const p2 = p1.then(function() {
    return p2
  })

  try {
    await p2
  } catch(err) {
    expect(p2._reason instanceof TypeError).toBeTruthy()
  }
})

test("should tell is pending", () => {
  const p = new Promise(function(resolve, reject) {})
  expect(p.isPending()).toBeTruthy()
  expect(p.isFulfilled()).toBeFalsy()
  expect(p.isRejected()).toBeFalsy()
})

test("should tell is fulfilled", () => {
  const p = new Promise(function(resolve, reject) {
    resolve()
  })

  expect(p.isPending()).toBeFalsy()
  expect(p.isFulfilled()).toBeTruthy()
  expect(p.isRejected()).toBeFalsy()

  p.resolve()
  expect(p.isFulfilled()).toBeTruthy()
})

test("should tell is rejected", () => {
  const p = new Promise(function(resolve, reject) {
    reject()
  })
  expect(p.isPending()).toBeFalsy()
  expect(p.isFulfilled()).toBeFalsy()
  expect(p.isRejected()).toBeTruthy()
})

test("should finally call the handler", done => {
  let counter = 0
  let handler = function(val) {
    counter++
  }

  let p = Promise.resolve(1)
  p.finally(handler)

  p = Promise.reject(1)
  p.finally(handler)

  setTimeout(function() {
    expect(counter).toBe(2)
    done()
  }, 10)
})

test("should catch the error finally", done => {
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
      expect(e).toBe(err)
      done()
    })
})

test("should get the result after the promises resolve", done => {
  const promises = [1, 2, 3].map(function(i) {
    return new Promise(function(resolve) {
      resolve(i * i)
    })
  })

  Promise.all(promises).then(function(result) {
    expect(result).toEqual([1, 4, 9])
    expect(
      promises.map(function(item) {
        return item._state
      })).toEqual([1, 1, 1])

    done()
  })
})

test("should execute in order", done => {
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
    expect(result).toEqual([2, 1, 3])
    done()
  })
})

test("should get the error if some throw error", done => {
  const promises = [3, 2, 1].map(function(i) {
    return new Promise(function(resolve, reject) {
      reject(i * i)
    })
  })

  Promise.all(promises).catch(function(result) {
    expect(result).toBe(9)
    done()
  })
})

test("should rece the promises", done => {
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
    expect(err).toBe(1)
  })

  Promise.race(promises).then(function(result) {
    expect(result).toBe(1)
    done()
  })
})

test("should reject a value to promise", () => {
  const promise = Promise.reject(new Error())
  expect(promise instanceof Promise).toBeTruthy()
})

test("should resolve a value to promise", () => {
  const promise = Promise.resolve()
  expect(promise instanceof Promise).toBeTruthy()
})

test('defer', () => {
  const defer = Promise.defer()

  expect(defer.resolve instanceof Function).toBeTruthy()
  expect(defer.reject instanceof Function).toBeTruthy()
  expect(defer.promise instanceof Promise).toBeTruthy()
})