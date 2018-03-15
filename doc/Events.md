# Events

自定义事件模块

## how to use

```
import Events from 'dx-lib/lib/Events'

const events = new Events()

events.on('event', function(v1, v2) {

})

// 同events.once
events.one('event1 event2', function(v1, v2) {

})

// 同events.trigger
events.emit('event', 1, 2)

events.off([event], [callback])
```