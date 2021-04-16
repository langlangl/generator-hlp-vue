/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/**
 * @returns {any} 返回 set 或者 get
 */
function cookie(...args) {
  // if arguments.length > 1,set cookie
  if (args.length > 1) {
    return cookie.set.apply(this, [].slice.call(args))
  }
  return cookie.get.apply(this, [].slice.call(args))
}

/**
 * @param {any} key cookie 键名
 * @param {any} value cookie 键值
 * @param {any} attrs cookie attrs
 * @returns {string} ‘key=value’
 */
cookie.set = (key, value, attrs) => {
  if (!key) {
    return false
  }

  attrs = { ...attrs }
  // set expires
  if (typeof attrs.expires === 'number') {
    const expires = new Date()

    expires.setMilliseconds(expires.getMilliseconds() + attrs.expires * 864e5)
    attrs.expires = expires
  }

  // handle value
  try {
    const result = JSON.stringify(value)

    // object or array
    if (/^[{[]/.test(result)) {
      value = result
    }
  } catch (e) {
    // console.log(e);
  }

  value = encodeURIComponent(String(value))

  // handle key
  key = encodeURIComponent(String(key))
    .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
    .replace(/[()]/g, escape)

  return [key, '=', value].join('')
}
/**
 * @param {string} cookies 字符串
 * @returns {obejct} end 解析的对象
 */
cookie.parse = (cookies) => {
  cookies = cookies ? cookies.split(';') : []
  const end = {}

  let item = []

  const rdecode = /(%[0-9A-Z]{2})+/g
  try {
    cookies.forEach((val) => {
      item = val.split('=')
      const _key = item[0].trim().replace(rdecode, decodeURIComponent)
      let _val = item[1].replace(rdecode, decodeURIComponent)
      if (/^"/.test(_val)) {
        _val = _val.slice(1, -1)
      }
      end[_key] = _val || ''
    })
  } catch (e) {
    // console.log(e);
  }

  return end
}

/**
 * @param {any} cookies 对象
 * @returns {string} cookie 字符串
 */
cookie.genarator = (cookies) => {
  const str = []
  Object.keys(cookies).forEach((key) => {
    str.push(cookie.set(key, cookies[key]))
  })

  return str.join('; ')
}

export default cookie
