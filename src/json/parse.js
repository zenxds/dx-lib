/**
 * https://code.jquery.com/jquery-1.11.3.js
 */
const rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g
const rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g

function trim(str) {
  return str.replace(rtrim, "")
}

export default function(data) {
  if (window.JSON && window.JSON.parse) {
    return window.JSON.parse(data + "")
  }

  let requireNonComma
  let depth = null
  let str = trim(data + "")

  // Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
  // after removing valid tokens
  if (
    str &&
    !trim(
      str.replace(rvalidtokens, function(token, comma, open, close) {
        // Force termination if we see a misplaced comma
        if (requireNonComma && comma) {
          depth = 0
        }

        // Perform no more replacements after returning to outermost depth
        if (depth === 0) {
          return token
        }

        // Commas must not follow "[", "{", or ","
        requireNonComma = open || comma

        // Determine new depth
        // array/object open ("[" or "{"): depth += true - false (increment)
        // array/object close ("]" or "}"): depth += false - true (decrement)
        // other cases ("," or primitive): depth += true - true (numeric cast)
        depth += !close - !open

        // Remove this token
        return ""
      })
    )
  ) {
    return Function("return " + str)()
  } else {
    throw new Error("Invalid JSON: " + data)
  }
}