const rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
function trim(str) {
  return str.replace(rtrim, '')
}

function camelize(str) {
  return str.replace(/[-_][^-_]/g, function (match) {
    return match.charAt(1).toUpperCase()
  })
}

export default function parseHeaders(str) {
  const ret = {}
  const arr = trim(str).split(/[\r\n]+/)

  for (let i = 0; i < arr.length; i++) {
    const parts = arr[i].split(': ')
    const header = camelize(parts.shift())
    const value = parts.join(': ')
    ret[header] = value
  }

  return ret
}
