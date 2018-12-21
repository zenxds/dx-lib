import { param } from '../param/index.js'
import Promise from '../Promise/index.js'

/**
 * jsonp
 * 依赖param函数
 */
const head = document.head || document.getElementsByTagName('head')[0]

const jsonp = (options={}) => {
  options = mix({
    url: '',
    data: {},
    callback: 'callback',
    timeout: 30 * 1000
  }, options)

  let { url, data, callback, timeout } = options
  let fn = '_' + String(Math.random()).substring(2)
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
    script.onerror = err => {
      reject(err || new Error('jsonp error'))
    }
    head.appendChild(script)

    setTimeout(function() {
      reject(new Error('jsonp timeout'))
    }, timeout)
  })
}

function mix(target, ...sources) {
  for (let i = 0; i < sources.length; i++) {
    let source = sources[i]

    for (let prop in source) {
      if (source.hasOwnProperty(prop)) {
        target[prop] = source[prop]
      }
    }
  }
  return target
}

export default jsonp
