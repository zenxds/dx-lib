// Events
// -----------------
// https://github.com/aralejs/events
// Thanks to:
//  - https://github.com/documentcloud/backbone/blob/master/backbone.js
//  - https://github.com/joyent/node/blob/master/lib/events.js
// remove context, arrow function is enough

// Regular expression used to split event strings
const eventSplitter = /\s+/

// A module that can be mixed in to *any object* in order to provide it
// with custom events. You may bind with `on` or remove with `off` callback
// functions to an event; `trigger`-ing an event fires all callbacks in
// succession.
//
//     var object = new Events();
//     object.on('expand', function(){ alert('expanded'); });
//     object.trigger('expand');

class Events {
  constructor() {}

  // Bind one or more space separated events, `events`, to a `callback`
  // function. Passing `"all"` will bind the callback to all events fired.
  on(events, callback) {
    if (!callback) {
      return this
    }

    events = events.split(eventSplitter)

    let cache = this.__events || (this.__events = {})
    let event, list

    while (event = events.shift()) {
      list = cache[event] || (cache[event] = [])
      list.push(callback)
    }

    return this
  }

  one(events, callback) {
    let cb = (...args) => {
      this.off(events, cb)
      callback(...args)
    }

    return this.on(events, cb)
  }

  // Remove one or many callbacks. If `context` is null, removes all callbacks
  // with that function. If `callback` is null, removes all callbacks for the
  // event. If `events` is null, removes all bound callbacks for all events.
  off(events, callback) {
    let cache = this.__events
    let event, list
    
    if (!cache) {
      return this
    }

    // No events, or removing *all* events.
    if (!(events || callback)) {
      delete this.__events
      return this
    }

    events = events ? events.split(eventSplitter) : keys(cache)

    while (event = events.shift()) {
      list = cache[event]

      if (!list) {
        continue
      }

      if (!callback) {
        delete cache[event]
        continue
      }

      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i] === callback) {
          list.splice(i, 1)
        }
      }
    }

    return this
  }

  // Trigger one or many events, firing all bound callbacks. Callbacks are
  // passed the same arguments as `trigger` is, apart from the event name
  // (unless you're listening on `"all"`, which will cause your callback to
  // receive the true name of the event as the first argument).
  emit(events, ...rest) {
    let cache = this.__events
    if (!cache) {
      return this
    }

    events = events.split(eventSplitter)

    let event, list, all
    let returned = true

    // For each event, walk through the list of callbacks twice, first to
    // trigger the event, then to trigger any `"all"` callbacks.
    while ((event = events.shift())) {
      // Copy callback lists to prevent modification.
      if ((all = cache.all)) {
        all = all.slice()
      }

      if ((list = cache[event])) {
        list = list.slice()
      }

      // Execute event callbacks except one named "all"
      if (event !== "all") {
        returned = triggerEvents(list, rest, this) && returned
      }

      // Execute "all" callbacks.
      returned = triggerEvents(all, [event].concat(rest), this) && returned
    }

    return returned
  }
}

Events.prototype.trigger = Events.prototype.emit
Events.prototype.once = Events.prototype.one

// Helpers
// -------

let keys = Object.keys

if (!keys) {
  keys = function(o) {
    let result = []

    for (let name in o) {
      if (o.hasOwnProperty(name)) {
        result.push(name)
      }
    }
    return result
  }
}

// Execute callbacks
function triggerEvents(list, args, context) {
  let pass = true

  if (list) {
    let i = 0
    let l = list.length
    let a1 = args[0]
    let a2 = args[1]
    let a3 = args[2]

    // call is faster than apply, optimize less than 3 argu
    // http://blog.csdn.net/zhengyinhui100/article/details/7837127
    switch (args.length) {
      case 0:
        for (; i < l; i += 1) {
          pass = list[i].call(context) !== false && pass
        }
        break
      case 1:
        for (; i < l; i += 1) {
          pass = list[i].call(context, a1) !== false && pass
        }
        break
      case 2:
        for (; i < l; i += 1) {
          pass = list[i].call(context, a1, a2) !== false && pass
        }
        break
      case 3:
        for (; i < l; i += 1) {
          pass =
            list[i].call(context, a1, a2, a3) !== false && pass
        }
        break
      default:
        for (; i < l; i += 1) {
          pass = list[i].apply(context, args) !== false && pass
        }
        break
    }
  }

  // trigger will return false if one of the callbacks return false
  return pass
}

export default Events
