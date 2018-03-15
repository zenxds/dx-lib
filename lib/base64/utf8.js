// http://www.ruanyifeng.com/blog/2014/12/unicode.html
//
// UTF-8是一种变长的编码方法，字符长度从1个字节到4个字节不等
// UTF-16编码介于UTF-32与UTF-8之间，同时结合了定长和变长两种编码方法的特点。
// 它的编码规则很简单：基本平面的字符占用2个字节，辅助平面的字符占用4个字节。

// https://en.wikipedia.org/wiki/UTF-8
// 0000 0000-0000 007F | 0xxxxxxx 7 bits, stored in 1 byte
// 0000 0080-0000 07FF | 110xxxxx 10xxxxxx 5+6 bits = 11 bits, stored in 2 bytes
// 0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx 4+6+6 bits = 16 bits, stored in 3 bytes
// 0001 0000-0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx


/**
 * Encode multi-byte Unicode string into utf-8 multiple single-byte characters
 * (BMP / basic multilingual plane only)
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
 *
 */
export function encode(str) {
  if (!str) {
    return ''
  }

  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
  // 拆分后的单字节以1开头，utf8中没有在用
  return String(str).replace(
    /[\u0080-\u07ff]/g,
    function (c) {
      let cc = c.charCodeAt(0)
      return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f)
    }
  ).replace(
    /[\u0800-\uffff]/g,
    function (c) {
      let cc = c.charCodeAt(0)
      return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3f, 0x80 | cc & 0x3f)
    }
  )
}

export function decode(str) {
  if (!str) {
    return ''
  }

  // 跟上面转换过的范围一一对应
  // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
  return str.replace(
    /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
    function (c) { // (note parentheses for precence)
      let cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f)
      return String.fromCharCode(cc)
    }
  ).replace(
    /[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
    function (c) { // (note parentheses for precence)
      let cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f
      return String.fromCharCode(cc)
    }
  )
}