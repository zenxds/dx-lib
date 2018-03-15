// 如果不想依赖Utf8则可以使用原生的encodeURI
import { encode as utf8Encode, decode as utf8Decode } from './utf8.js'

// code顺序可以自定义
const base64Code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

// http://www.webtoolkit.info/javascript-base64.html
export const encode = function (input, code=base64Code) {
  if (!input) {
    return ''
  }

  let output = ''
  let chr1, chr2, chr3, enc1, enc2, enc3, enc4
  let i = 0

  // input = encodeURI(input);
  input = utf8Encode(input)

  while (i < input.length) {
    chr1 = input.charCodeAt(i++)
    chr2 = input.charCodeAt(i++)
    chr3 = input.charCodeAt(i++)

    // 第一个字符前6位
    enc1 = chr1 >> 2
    // 第一个字符后两位加第二个字符前4位
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
    // 第二个字符后四位加第三个字符前两位
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
    // 第三个字符后六位
    enc4 = chr3 & 63

    if (isNaN(chr2)) {
      enc3 = enc4 = 64
    } else if (isNaN(chr3)) {
      enc4 = 64
    }

    output = output + code.charAt(enc1) + code.charAt(enc2) +
      code.charAt(enc3) + code.charAt(enc4)
  }
  return output
}

export const decode = function(input, code=base64Code) {
  if (!input) {
    return ''
  }

  let output = ''
  let chr1, chr2, chr3
  let enc1, enc2, enc3, enc4
  let i = 0

  // 保证格式正确
  // 在自定义base64字符集时不使用
  // input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')

  while (i < input.length) {
    enc1 = code.indexOf(input.charAt(i++))
    enc2 = code.indexOf(input.charAt(i++))
    enc3 = code.indexOf(input.charAt(i++))
    enc4 = code.indexOf(input.charAt(i++))

    chr1 = (enc1 << 2) | (enc2 >> 4)
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
    chr3 = ((enc3 & 3) << 6) | enc4

    output = output + String.fromCharCode(chr1)
    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2)
    }
    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3)
    }
  }

  // output = decodeURI(output);
  output = utf8Decode(output)
  return output
}