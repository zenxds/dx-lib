import { param } from '../param'
import Promise from '../Promise'
import { parseJSON } from '../json'
import isPlainObject from './isPlainObject'
import parseHeaders from './parseHeaders'

const noop = function () {}

/**
 * @param {*} options
 * method
 * url
 * data
 * dataType
 * async
 * headers
 * credentials
 * timeout
 */
export default (options = {}) => {
  options = mix(
    {
      method: 'GET',
      url: '',
      dataType: 'json',
      data: {},
      headers: {},
      timeout: 30 * 1000,
      async: true,
      cache: true,
      credentials: false
    },
    options
  )

  options.method = options.method.toUpperCase()
  options.dataType = options.dataType.toUpperCase()
  options.headers.Accept = 'application/json, text/plain, */*'

  if (options.method === 'GET' && isPlainObject(options.data)) {
    if (!options.cache) {
      options.data._ = Math.random().toString().slice(2)
    }
    options.url +=
      (options.url.indexOf('?') > 0 ? '&' : '?') + param(options.data)
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const onerror = error => {
      reject({
        request: xhr,
        options,
        error
      })
    }
    const onsuccess = data => {
      resolve({
        request: xhr,
        options,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: xhr.getAllResponseHeaders
          ? parseHeaders(xhr.getAllResponseHeaders())
          : {},
        data
      })
    }

    const onload = () => {
      let status = xhr.status
      // IE会将204设置为1223
      // Opear会将204设置为0，这里先不处理0
      if ((status >= 200 && status < 300) || status == 304 || status === 1223) {
        let resp = xhr.response || xhr.responseText

        if (options.dataType === 'JSON') {
          try {
            onsuccess(parseJSON(resp))
          } catch (err) {
            onerror(err)
          }
        } else {
          onsuccess(resp)
        }
      } else {
        onerror(new Error('Request Error ' + xhr.status))
      }
    }
    const ontimeout = () => {
      onerror(new Error('Request Timeout'))
    }
    const onabort = () => {
      onerror(new Error('Request Abort'))
    }
    const setRequestHeader =
      'setRequestHeader' in xhr
        ? (k, v) => {
            xhr.setRequestHeader(k, v)
          }
        : noop

    if ('onload' in xhr) {
      xhr.onload = onload
    } else {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          onload()
        }
      }
    }

    // onerror
    if ('onerror' in xhr) {
      xhr.onerror = err => {
        let message = ''

        if (err) {
          message = err.message || err.name || err.type
        }

        if (!message || message === 'error') {
          message = xhr.responseText || 'Request Error'
        }

        onerror(new Error(message))
      }
    }

    if ('onabort' in xhr) {
      xhr.onabort = onabort
    }

    // timeout
    // IE8设置timeout会抛出错误
    try {
      xhr.timeout = options.timeout
      xhr.ontimeout = ontimeout
    } catch (err) {
      setTimeout(ontimeout, options.timeout)
    }

    // open
    xhr.open(options.method, options.url, options.async)
    if ('withCredentials' in xhr) {
      xhr.withCredentials = options.credentials
    }

    for (let i in options.headers) {
      setRequestHeader(i, options.headers[i])
    }
    // setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    if (/^(HEAD|GET)$/.test(options.method)) {
      xhr.send(null)
    } else {
      let data = options.data
      if (isPlainObject(data)) {
        data = param(data)
        setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      }

      xhr.send(data)
    }
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
