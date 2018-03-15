import test from 'ava'
import expect from 'expect.js'
import sinon from 'sinon'
import Events from '../../lib/Events'

test('on and emit', t => {
  let obj = new Events()
  let spy = sinon.spy()

  obj.on('event', spy)

  obj.emit('event', 1, 2)
  expect(spy.callCount).to.be(1)

  obj.emit('event')
  obj.emit('event')
  obj.emit('event')
  obj.emit('event')
  expect(spy.callCount).to.be(5)

  t.pass()
})

test('on and emit', t => {
  let obj = new Events()
  let spy = sinon.spy()

  obj.on('event', spy)

  obj.emit('event')
  expect(spy.callCount).to.be(1)

  obj.emit('event')
  obj.emit('event')
  obj.emit('event')
  obj.emit('event')
  expect(spy.callCount).to.be(5)

  t.pass()
})

test('binding and triggering multiple events', t => {
  let obj = new Events()
  let spy = sinon.spy()

  obj.on('a b c', spy)

  obj.trigger('a')
  expect(spy.callCount).to.be(1)

  obj.trigger('a b')
  expect(spy.callCount).to.be(3)

  obj.trigger('c')
  expect(spy.callCount).to.be(4)

  obj.off('a c')
  obj.trigger('a b c')
  expect(spy.callCount).to.be(5)

  t.pass()
})

test('trigger all for each event', t => {
  let obj = new Events()
  let spy = sinon.spy()
  let spy2 = sinon.spy()

  obj.on('all', spy)
  obj.on('c', spy2)

  obj.trigger('a b')
  expect(spy.callCount).to.be(2)
  expect(spy.calledWith('a'))
  expect(spy.calledWith('b'))

  obj.trigger('c')
  expect(spy.callCount).to.be(3)
  expect(spy2.callCount).to.be(1)
  expect(spy2.calledBefore(spy))

  t.pass()
})

test('on, then unbind all functions', t => {
  let obj = new Events()
  let spy = sinon.spy()

  obj.on('event', spy)
  obj.trigger('event')
  expect(spy.callCount).to.be(1)

  obj.off('event')
  obj.trigger('event')
  expect(spy.callCount).to.be(1)

  t.pass()
})

test('bind two callbacks, unbind only one', t => {
  let obj = new Events()
  let spyA = sinon.spy()
  let spyB = sinon.spy()

  obj.on('event', spyA)
  obj.on('event', spyB)

  obj.trigger('event')
  expect(spyA.callCount).to.be(1)
  expect(spyB.callCount).to.be(1)

  obj.off('event', spyA)
  obj.trigger('event')
  expect(spyA.callCount).to.be(1)
  expect(spyB.callCount).to.be(2)

  t.pass()
})

test('unbind a callback in the midst of it firing', t => {
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

  expect(spy.callCount).to.be(1)
  t.pass()
})

test('two binds that unbind themselves', t => {
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

  expect(spyA.callCount).to.be(1)
  expect(spyB.callCount).to.be(1)

  t.pass()
})

test('bind a callback with a supplied context', t => {
  let obj = new Events()
  let context = {}
  let spy = sinon.spy()

  obj.on('event', spy.bind(context), context)

  obj.trigger('event')
  expect(spy.calledOn(context))

  t.pass()
})

test('nested trigger with unbind', t => {
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

  expect(spy1.callCount).to.be(1)
  expect(spy2.callCount).to.be(2)

  t.pass()
})

test('callback list is not altered during trigger', t => {
  let obj = new Events()
  let spy = sinon.spy()

  obj.on('event',function() {
    obj.on('event', spy).on('all', spy)
  }).trigger('event')

  // bind does not alter callback list
  expect(spy.callCount).to.equal(0)

  obj.off()
      .on('event', function() {
        obj.off('event', spy).off('all', spy)
      })
      .on('event', spy)
      .on('all', spy)
      .trigger('event')

  // unbind does not alter callback list
  expect(spy.callCount).to.equal(2)

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

  t.pass()
})

test('`o.trigger("x y")` is equal to `o.trigger("x").trigger("y")`', t => {
  let obj = new Events()
  let spy = sinon.spy()

  obj.on('x', function() {
    obj.on('y', spy)
  })
  obj.trigger('x y')

  expect(spy.callCount).to.be(1)

  obj.off()
  obj.on('x', function() {
    obj.on('y', spy)
  })
  obj.trigger('y x')

  expect(spy.callCount).to.be(1)

  t.pass()
})

test('`all` callback list is retrieved after each event', t => {
  let obj = new Events()
  let spy = sinon.spy()

  obj.on('x',function() {
    obj.on('y', spy).on('all', spy)
  }).trigger('x y')

  expect(spy.callCount).to.be(2)

  t.pass()
})

test('if no callback is provided, `on` is a noop', t => {
  expect(function() {
    new Events().on('test').trigger('test')
  }).not.to.throwException()

  t.pass()
})

test('remove all events for a specific callback', t => {
  let obj = new Events()
  let success = sinon.spy()
  let fail = sinon.spy()

  obj.on('x y all', success)
  obj.on('x y all', fail)
  obj.off(null, fail)
  obj.trigger('x y')

  expect(success.callCount).to.equal(4)
  expect(fail.callCount).to.equal(0)

  t.pass()
})

test('off is chainable', t => {
  let obj = new Events()

  // With no events
  expect(obj.off()).to.equal(obj)

  // When removing all events
  obj.on('event', function() {
  }, obj)
  expect(obj.off()).to.equal(obj)

  // When removing some events
  obj.on('event', function() {
  }, obj)
  expect(obj.off('event')).to.equal(obj)

  t.pass()
})

test('splice bug for `off`', t => {
  var spy1 = sinon.spy()
  var spy2 = sinon.spy()

  var obj = new Events()
  obj.on('event', spy1)
  obj.on('event', spy1)
  obj.on('event', spy2)

  obj.trigger('event')
  expect(spy1.callCount).to.be(2)
  expect(spy2.callCount).to.be(1)

  obj.off(null, spy1)
  obj.off(null, spy2)

  obj.trigger('event')
  expect(spy1.callCount).to.be(2)
  expect(spy2.callCount).to.be(1)

  t.pass()
})

test('trigger returns callback status', t => {
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
  expect(obj.trigger('a')).to.be(false)

  stub1.returns(undefined)
  stub2.returns(null)
  stub3.returns('')
  expect(obj.trigger('a')).not.to.be(false)

  stub1.returns(true)
  stub2.returns(true)
  stub3.returns(false)
  expect(obj.trigger('a')).to.be(false)

  t.pass()
})

test('callback context', t => {
  var obj = new Events()
  var spy = sinon.spy()
  obj.on('a', spy)

  obj.trigger('a')
  expect(spy.calledOn(obj)).to.be.ok()

  t.pass()
})

test('trigger arguments', t => {
  var obj = new Events()
  var spy1 = sinon.spy()
  var spy2 = sinon.spy()

  obj.on('a', spy1)
  obj.on('all', spy2)
  obj.trigger('a', 1, 2, 3)
  expect(spy1.calledWith(1, 2, 3)).to.be.ok()
  expect(spy2.calledWith('a', 1, 2, 3)).to.be.ok()

  t.pass()
})

test('#11 triggerEvents should not return undefined', t => {
  var obj = new Events()
  obj.on('a', function(){})
  expect(obj.trigger('all', 1)).to.be(true)

  t.pass()
})

test('#12 callback should be called only once when trigger', t => {
  var spy = sinon.spy()
  var object = new Events()
  object.on('all', spy)
  object.trigger('all')
  expect(spy.callCount).to.be(1)

  t.pass()
})