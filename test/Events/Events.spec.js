import sinon from 'sinon'
import Events from '../../src/Events'

test('on and emit', () => {
  let obj = new Events()
  let spy = sinon.spy()

  obj.on('event', spy)

  obj.emit('event', 1, 2)
  expect(spy.callCount).toBe(1)

  obj.emit('event')
  obj.emit('event')
  obj.emit('event')
  obj.emit('event')
  expect(spy.callCount).toBe(5)
})

test('on and emit', () => {
  let obj = new Events()
  let spy = sinon.spy()

  obj.on('event', spy)

  obj.emit('event')
  expect(spy.callCount).toBe(1)

  obj.emit('event')
  obj.emit('event')
  obj.emit('event')
  obj.emit('event')
  expect(spy.callCount).toBe(5)
})

test('binding and triggering multiple events', () => {
  let obj = new Events()
  let spy = sinon.spy()

  obj.on('a b c', spy)

  obj.trigger('a')
  expect(spy.callCount).toBe(1)

  obj.trigger('a b')
  expect(spy.callCount).toBe(3)

  obj.trigger('c')
  expect(spy.callCount).toBe(4)

  obj.off('a c')
  obj.trigger('a b c')
  expect(spy.callCount).toBe(5)
})

test('trigger all for each event', () => {
  let obj = new Events()
  let spy = sinon.spy()
  let spy2 = sinon.spy()

  obj.on('all', spy)
  obj.on('c', spy2)

  obj.trigger('a b')
  expect(spy.callCount).toBe(2)
  expect(spy.calledWith('a'))
  expect(spy.calledWith('b'))

  obj.trigger('c')
  expect(spy.callCount).toBe(3)
  expect(spy2.callCount).toBe(1)
  expect(spy2.calledBefore(spy))
})

test('on, then unbind all functions', () => {
  let obj = new Events()
  let spy = sinon.spy()

  obj.on('event', spy)
  obj.trigger('event')
  expect(spy.callCount).toBe(1)

  obj.off('event')
  obj.trigger('event')
  expect(spy.callCount).toBe(1)
})

test('bind two callbacks, unbind only one', () => {
  let obj = new Events()
  let spyA = sinon.spy()
  let spyB = sinon.spy()

  obj.on('event', spyA)
  obj.on('event', spyB)

  obj.trigger('event')
  expect(spyA.callCount).toBe(1)
  expect(spyB.callCount).toBe(1)

  obj.off('event', spyA)
  obj.trigger('event')
  expect(spyA.callCount).toBe(1)
  expect(spyB.callCount).toBe(2)
})

test('unbind a callback in the midst of it firing', () => {
  let obj = new Events()
  let spy = sinon.spy()

  function callback() {
    spy()
    obj.off('event', callback)
  }

  obj.on('event', callback)
  obj.trigger('event')
  obj.trigger('event')
  obj.trigger('event')

  expect(spy.callCount).toBe(1)
})

test('two binds that unbind themselves', () => {
  let obj = new Events()
  let spyA = sinon.spy()
  let spyB = sinon.spy()

  function incrA() {
    spyA()
    obj.off('event', incrA)
  }

  function incrB() {
    spyB()
    obj.off('event', incrB)
  }

  obj.on('event', incrA)
  obj.on('event', incrB)
  obj.trigger('event')
  obj.trigger('event')
  obj.trigger('event')

  expect(spyA.callCount).toBe(1)
  expect(spyB.callCount).toBe(1)
})

test('bind a callback with a supplied context', () => {
  let obj = new Events()
  let context = {}
  let spy = sinon.spy()

  obj.on('event', spy.bind(context), context)

  obj.trigger('event')
  expect(spy.calledOn(context))
})

test('nested trigger with unbind', () => {
  let obj = new Events()
  let spy1 = sinon.spy()
  let spy2 = sinon.spy()

  function incr1() {
    spy1()
    obj.off('event', incr1)
    obj.trigger('event')
  }

  obj.on('event', incr1)
  obj.on('event', spy2)
  obj.trigger('event')

  expect(spy1.callCount).toBe(1)
  expect(spy2.callCount).toBe(2)
})

test('callback list is not altered during trigger', () => {
  let obj = new Events()
  let spy = sinon.spy()

  obj.on('event',function() {
    obj.on('event', spy).on('all', spy)
  }).trigger('event')

  // bind does not alter callback list
  expect(spy.callCount).toBe(0)

  obj.off()
      .on('event', function() {
        obj.off('event', spy).off('all', spy)
      })
      .on('event', spy)
      .on('all', spy)
      .trigger('event')

  // unbind does not alter callback list
  expect(spy.callCount).toBe(2)

  // 注：
  // 1. jQuery 里，是冻结的，在 triggering 时，新增或删除都不影响
  //    当前 callbacks list
  // 2. Backbone 同 jQuery
  // 3. Chrome 下，原生 addEventListener:
  //    - 新增的，需要下一次才触发
  //    - 其他修改，立刻生效（与 forEach 类似）
  //    - 如果 addEventListener 同一个 fn, 会去重，只触发一次
  // 4. NodeJS 也是冻结的（slice 了一下）
  //
  // 从 emit 性质考虑，各个 callback 间不应该互相影响，因此 jQuery 的方式
  // 是值得推崇的：任何修改，都等下一次才生效。
  //
  // Ref:
  //  - https://github.com/documentcloud/backbone/pull/723
})

test('`o.trigger("x y")` is equal to `o.trigger("x").trigger("y")`', () => {
  let obj = new Events()
  let spy = sinon.spy()

  obj.on('x', function() {
    obj.on('y', spy)
  })
  obj.trigger('x y')

  expect(spy.callCount).toBe(1)

  obj.off()
  obj.on('x', function() {
    obj.on('y', spy)
  })
  obj.trigger('y x')

  expect(spy.callCount).toBe(1)
})

test('`all` callback list is retrieved after each event', () => {
  let obj = new Events()
  let spy = sinon.spy()

  obj.on('x',function() {
    obj.on('y', spy).on('all', spy)
  }).trigger('x y')

  expect(spy.callCount).toBe(2)
})

test('if no callback is provided, `on` is a noop', () => {
  expect(function() {
    new Events().on('test').trigger('test')
  }).not.toThrow()
})

test('remove all events for a specific callback', () => {
  let obj = new Events()
  let success = sinon.spy()
  let fail = sinon.spy()

  obj.on('x y all', success)
  obj.on('x y all', fail)
  obj.off(null, fail)
  obj.trigger('x y')

  expect(success.callCount).toBe(4)
  expect(fail.callCount).toBe(0)
})

test('off is chainable', () => {
  let obj = new Events()

  // With no events
  expect(obj.off()).toBe(obj)

  // When removing all events
  obj.on('event', function() {
  }, obj)
  expect(obj.off()).toBe(obj)

  // When removing some events
  obj.on('event', function() {
  }, obj)
  expect(obj.off('event')).toBe(obj)
})

test('splice bug for `off`', () => {
  var spy1 = sinon.spy()
  var spy2 = sinon.spy()

  var obj = new Events()
  obj.on('event', spy1)
  obj.on('event', spy1)
  obj.on('event', spy2)

  obj.trigger('event')
  expect(spy1.callCount).toBe(2)
  expect(spy2.callCount).toBe(1)

  obj.off(null, spy1)
  obj.off(null, spy2)

  obj.trigger('event')
  expect(spy1.callCount).toBe(2)
  expect(spy2.callCount).toBe(1)
})

test('trigger returns callback status', () => {
  var obj = new Events()
  var stub1 = sinon.stub()
  var stub2 = sinon.stub()
  var stub3 = sinon.stub()

  obj.on('a', stub1)
  obj.on('a', stub2)
  obj.on('all', stub3)

  stub1.returns(false)
  stub2.returns(true)
  stub3.returns('')
  expect(obj.trigger('a')).toBe(false)

  stub1.returns(undefined)
  stub2.returns(null)
  stub3.returns('')
  expect(obj.trigger('a')).not.toBe(false)

  stub1.returns(true)
  stub2.returns(true)
  stub3.returns(false)
  expect(obj.trigger('a')).toBe(false)
})

test('callback context', () => {
  var obj = new Events()
  var spy = sinon.spy()
  obj.on('a', spy)

  obj.trigger('a')
  expect(spy.calledOn(obj)).toBeTruthy()
})

test('trigger arguments', () => {
  var obj = new Events()
  var spy1 = sinon.spy()
  var spy2 = sinon.spy()

  obj.on('a', spy1)
  obj.on('all', spy2)
  obj.trigger('a', 1, 2, 3)
  expect(spy1.calledWith(1, 2, 3)).toBeTruthy()
  expect(spy2.calledWith('a', 1, 2, 3)).toBeTruthy()
})

test('#11 triggerEvents should not return undefined', () => {
  var obj = new Events()
  obj.on('a', function(){})
  expect(obj.trigger('all', 1)).toBe(true)
})

test('#12 callback should be called only once when trigger', () => {
  var spy = sinon.spy()
  var object = new Events()
  object.on('all', spy)
  object.trigger('all')
  expect(spy.callCount).toBe(1)
})