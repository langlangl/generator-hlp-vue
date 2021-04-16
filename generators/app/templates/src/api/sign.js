/* eslint-disable no-plusplus */
/* eslint-disable no-return-assign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/*
 * @Author: Kuaiyin FE
 * @Date: 2020-07-13 00:35:27
 * @Description: 生成请求签名模块
 * @FilePath: /bt-game/src/api/request/sign.js
 */

import Qs from 'qs'
import hmacSHA256 from 'crypto-js/hmac-sha256'

/**
 * @description: 增加项目印记
 * @param {type}
 * @return:
 */

const _addTimeStampProperty = (params) => {
  const data = { ...params } // 浅复制一次
  const timeStamp = Math.floor(new Date().getTime() / 1000)

  data.t = timeStamp

  return data
}

/**
 * @description: 排序方法：根据首字母的Unicode编码大小进行比对排列，首字母相同时进行递归操作
 * @param {}
 * @return:void
 */

const _keySort = (k1, k2) => {
  const c1 = k1 && k1.charAt(0) ? k1.charAt(0).charCodeAt() : 0
  const c2 = k2 && k2.charAt(0) ? k2.charAt(0).charCodeAt() : 0
  if (!c1 && !c2) {
    return 0
  }
  if (c1 === c2) {
    return _keySort(k1.substring(1), k2.substring(1))
  }
  return c1 - c2
}

/**
 * @description: 对数组进行 key => value 排序
 * @param params {Object}
 * @return: sortedArr{Array}
 */

const _sortKeyValue = (params) => {
  const keys = Object.keys(params)
  keys.sort(_keySort)
  return keys
}

/**
 * @description: 重新组装数据
 * @param params {Object}
 * @param sortedArray {Array}
 * @return: Object
 */

const _assembleData = (params, sortedArray) => {
  const dataBeforeSign = {}
  const keyValueArray = []
  const data = { ...params }

  sortedArray.forEach((k) => {
    if (data[k] !== null && data[k] !== undefined) {
      dataBeforeSign[k] = data[k]
      let v = dataBeforeSign[k]
      if (typeof v === 'object') {
        v = JSON.stringify(v)
      }
      keyValueArray.push(`${k}=${v}`)
    }
  })

  return {
    dataBeforeSign,
    keyValueArray,
  }
}

/**
 * @description: 本地签名加密
 * @param keyValueArray{String}
 * @return: String
 * @key apple -> apple-is-foolish
 * @key grape ->vitisvinieral0o0
 * @key mango->yellowfruit-+*o0
 */

const _getSignature = (keyValueArray, need = true) => {
  const randomNum = window.parseInt(Math.random() * 10)
  let sig = ''
  const signString = need ? keyValueArray.join('&') : keyValueArray
  if (randomNum >= 0 && randomNum < 3) {
    sig = `apple|${hmacSHA256(signString, 'apple-is-foolish')
      .toString()
      .toUpperCase()}`
  } else if (randomNum >= 3 && randomNum < 7) {
    sig = `grape|${hmacSHA256(signString, 'vitisvinieral0o0')
      .toString()
      .toUpperCase()}`
  } else {
    sig = `mango|${hmacSHA256(signString, 'yellowfruit-+*o0')
      .toString()
      .toUpperCase()}`
  }
  return sig
}

/**
 * @description: 增加签名并格式化参数
 * @param dataBeforeSign{Object}
 * @param keyValueArray{Array}
 * @param isTaskRequest{Boolean}
 * @return: Object
 */

const _addSignAndStringifyData = (
  dataBeforeSign,
  keyValueArray,
  needSerialize = true
) => {
  const data = { ...dataBeforeSign }

  data.s = _getSignature(keyValueArray)
  return needSerialize
    ? {
        data: Qs.stringify(data),
      }
    : {
        data: JSON.stringify({ ...dataBeforeSign }).toString(),
        s: _getSignature(keyValueArray),
      }
}

/**
 * @description: 签名并字符串化数据
 * @param {type}
 * @return: data{Object}
 */

const signAndStringifyData = (
  params,
  isTaskRequest = false,
  needSerialize = true
) => {
  const data = { ...params }
  const addedTimeStampPropertyData = _addTimeStampProperty(data)
  if (!needSerialize) {
    return {
      data: JSON.stringify(addedTimeStampPropertyData),
      s: _getSignature(JSON.stringify(addedTimeStampPropertyData), false),
    }
  }
  let sortedKeyValues = []
  sortedKeyValues = _sortKeyValue(addedTimeStampPropertyData)
  const { dataBeforeSign, keyValueArray } = _assembleData(
    addedTimeStampPropertyData,
    sortedKeyValues
  )
  const result = _addSignAndStringifyData(
    dataBeforeSign,
    keyValueArray,
    needSerialize
  )
  return result
}

export default signAndStringifyData
