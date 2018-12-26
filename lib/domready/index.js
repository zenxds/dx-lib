import Promise from '../Promise/index.js'

/**
 * thanks to https://github.com/jquery/jquery/blob/1.12-stable/src/core/ready.js
 */
let isReady = false
let readyDefer = Promise.defer()

function ready() {
  if (isReady) {
    return
  }

  isReady = true
  readyDefer.resolve()
}

/**
 * Clean-up method for dom ready events
 */
function detach() {
  if (document.addEventListener) {
    document.removeEventListener("DOMContentLoaded", completed)
    window.removeEventListener("load", completed)
  } else {
    document.detachEvent("onreadystatechange", completed)
    window.detachEvent("onload", completed)
  }
}

/**
 * The ready event handler and self cleanup method
 */
function completed() {
  // readyState === "complete" is good enough for us to call the dom ready in oldIE
  if (document.addEventListener ||
    window.event.type === "load" ||
    document.readyState === "complete") {

    detach()
    ready()
  }
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE6-10
// Older IE sometimes signals "interactive" too soon
if (document.readyState === "complete" ||
  (document.readyState !== "loading" && !(document.documentElement && document.documentElement.doScroll))) {

  // Handle it asynchronously to allow scripts the opportunity to delay ready
  window.setTimeout(ready)

  // Standards-based browsers support DOMContentLoaded
} else if (document.addEventListener) {

  // Use the handy event callback
  document.addEventListener("DOMContentLoaded", completed)

  // A fallback to window.onload, that will always work
  window.addEventListener("load", completed)

  // If IE event model is used
} else if (document.attachEvent) {

  // Ensure firing before onload, maybe late but safe also for iframes
  document.attachEvent("onreadystatechange", completed)

  // A fallback to window.onload, that will always work
  window.attachEvent("onload", completed)

  // If IE and not a frame
  // continually check to see if the document is ready
  var top = false

  try {
    top = window.frameElement == null && document.documentElement
  } catch (e) {}

  if (top && top.doScroll) {
    (function doScrollCheck() {
      if (!isReady) {

        try {

          // Use the trick by Diego Perini
          // http://javascript.nwbox.com/IEContentLoaded/
          top.doScroll("left")
        } catch (e) {
          return window.setTimeout(doScrollCheck, 50)
        }

        // detach all dom ready events
        detach()

        // and execute any waiting functions
        ready()
      }
    })()
  }
}

export default readyDefer.promise