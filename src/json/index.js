export function parseJSON(data) {
  return JSON.parse(data + '')
}

export function stringifyJSON(value, replacer, space) {
  return JSON.stringify(value, replacer, space)
}
