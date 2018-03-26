import { param } from '../param/index.js'
import Promise from '../Promise/index.js'

/**
 * jsonp
 * 依赖param函数
 */
const head = document.head || document.getElementsByTagName('head')[0]

const jsonp = ({ url, data, callback, timeout }) => {
  url = url || ''
  data = data || {}
  callback = callback || 'callback'
  timeout = timeout || 30 * 1000

  const fn = '_' + String(Math.random()).substring(2)
  data[callback] = fn
  
  url += url.indexOf('?') > 0 ? '&' : '?'
  url += param(data)

  return new Promise((resolve, reject) => {
    const script = document.createElement("script")

    window[fn] = function(d) {
      resolve(d)
  
      try {
        head.removeChild(script)
        delete window[fn]
      } catch (e) {}
    }

    script.src = url
    head.appendChild(script)
    setTimeout(function() {
      reject(new Error('timeout'))
    }, timeout)
  })
}

export default jsonp
