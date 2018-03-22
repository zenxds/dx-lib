const toString = Object.prototype.toString
const isType = type => {
  return obj => {
    return toString.call(obj) == "[object " + type + "]"
  }
}

const isObject = isType('Object')

// IE10及以上的写法
// const isPlainObject = obj => (isObject(obj) && (Object.getPrototypeOf(obj) === Object.prototype))

const hasOwnProperty = (o, p) => {
  return Object.prototype.hasOwnProperty.call(o, p)
}

const isPlainObject = object => {
  // Must be an Object.
  // Because of IE, we also have to check the presence of the constructor property.
  // Make sure that Dom nodes and window objects don't pass through, as well
  if (!isObject(object) || object.nodeType || object.window === object) {
    return false
  }

  let key, constructor

  try {
    // Not own constructor property must be Object
    if ((constructor = object.constructor) && !hasOwnProperty(object, 'constructor') && !hasOwnProperty(constructor.prototype, 'isPrototypeOf')) {
      return false
    }
  } catch (e) {
    // IE8,9 Will throw exceptions on certain host objects
    return false
  }

  // Own properties are enumerated firstly, so to speed up,
  // if last one is own, then all properties are own.
  for (key in object) {}

  return key === undefined || hasOwnProperty(object, key)
}

export default isPlainObject