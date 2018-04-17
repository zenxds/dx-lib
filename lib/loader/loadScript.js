import Promise from '../Promise/index.js'

const head = document.head || document.getElementsByTagName("head")[0]

export default function(url, options={}) {
  let node = document.createElement("script")
  let defer = Promise.defer()

  options.timeout = options.timeout || 10000
  if (options.hour) {
    url += url.indexOf('?') > 0 ? '&' : '?'
    url += `t=${Math.floor(new Date() / 3600000)}`
  }

  node.charset = 'utf-8'
  node.async = true
  node.setAttribute('crossorigin', 'anonymous')
  // node.crossOrigin = 'anonymous'

  if ('onload' in node) {
    node.onload = onload
  } else {
    node.onreadystatechange = function() {
      if (/loaded|complete/.test(node.readyState)) {
        onload()
      }
    }
  }

  if ('onerror' in node) {
    node.onerror = function(err) {
      defer.reject(err)
    }
  }

  setTimeout(function() {
    defer.reject(new Error('timeout'))
  }, options.timeout)

  function onload() {
    node.onreadystatechange = node.onload = null
    head.removeChild(node)
    node = null

    defer.resolve()
  }

  node.src = url
  head.appendChild(node)

  return defer.promise
}