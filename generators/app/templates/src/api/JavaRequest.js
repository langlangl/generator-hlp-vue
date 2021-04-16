/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */

import Vue from 'vue'
import Axios from 'axios'
import Qs from 'qs'
import env from './../utils/env'
import Cookie from './cookie'
import SignAndStringifyData from './sign'

const vm = new Vue()
const { system: platform } = env
const GET_BASE_USER_INFO = () => {
  const { SDKUID, Token = '', bfs, appLang } = sessionStorage
  const userInfo = JSON.parse(bfs)
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection
  const { type } = connection
  const clientVersion = process.env.VUE_APP_CLIENT_VERSION

  return {
    sid: SDKUID,
    lan: appLang,
    token: Token,
    platform,
    'platform-v': userInfo.sdkv,
    'client-v': clientVersion,
    'device-id': userInfo.did,
    'network-type': type || 'WI-FI',
    'platform-model': userInfo.model,
    'platform-brand': userInfo.brand,
  }
}

const GET_BASE_REQUEST_PARAMS = (formatData) => {
  const contentType = 'application/json'
  const sign = {
    s: formatData.s,
  }
  return {
    paramsData: {},
    headers: { 'Content-Type': contentType, ...GET_BASE_USER_INFO(), ...sign },
    withCredentials: true,
    paramsSerializer(params) {
      return Qs.stringify({ ...params })
    },
  }
}

class HttpRequest {
  constructor(config) {
    this._axiosInstance = null
    this._showLoading = true
    this._config = config
    this._init(config)
  }

  /**
   * @description: 初始化方法，配置 axios 实例
   * @param {type}
   * @return: void
   */

  _init(config) {
    this._createAxiosInstance(config)
    this._setInterceptors(config)
  }

  /**
   * @description: 创建 axios 实例
   * @param config{object} 初始化 axios
   * @return: void
   */

  _createAxiosInstance(config) {
    const { baseURL } = config

    this._axiosInstance = Axios.create({
      baseURL,
      timeout: 15000,
    })
  }

  /**
   * @description: 设置请求和响应拦截
   * @param {type}
   * @return:
   */

  _setInterceptors() {
    // 请求拦截
    this._axiosInstance.interceptors.request.use(
      (config) => {
        // console.log(`interceptors.request--success ${JSON.stringify(config)}`);
        if (!config.header) {
          Object.assign(config, { header: {} })
        }
        const cookies =
          'Cookie' in config.header ? Cookie.parse(config.header.Cookie) : {}

        Object.assign(config, {
          header: {
            ...config.header,
            'content-type':
              config.header['content-type'] ||
              'application/x-www-form-urlencoded',
            Cookie: Cookie.genarator({ ...cookies }),
          },
        })
        if (this._showLoading) {
          // vm.$bus.emit('loading', 1)
        }
        return config
      },
      (error) => {
        // console.log(`interceptors.request--error ${JSON.stringify(error)}`);
      }
    )

    // 响应拦截
    // 返回状态拦截，进行状态的集中判断
    this._axiosInstance.interceptors.response.use(
      (response) => {
        // 每成功响应一个请求，loading 队列 -1
        if (this._showLoading) {
          // vm.$bus.emit('loading', -1)
        }
        const { status, data } = response
        const { code, message } = data

        if (status >= 200 && status < 300) {
          if (code !== 0) {
            if (message) {
              vm.$toast(message)
            }
          }
        } else {
          vm.$toast('服务器异常，请稍后再试')
        }
        return response
      },
      (error) => {
        // 请求出错，loading 队列 -1
        if (this._showLoading) {
          // vm.$bus.emit('loading', -1)
        }
        return error
      }
    )
  }

  /**
   * @description: 格式化参数，签名
   * @param method {String} 请求方法
   * @param data {Object} 请求参数
   * @return: params{Object}
   */
  _formatAndSignData(method, params) {
    const { baseURL } = this._axiosInstance.defaults
    const isTaskRequest = Boolean(baseURL === '/api')

    if (method === 'GET') {
      return {
        params,
      }
    }
    return SignAndStringifyData(params, isTaskRequest, false)
  }

  /**
   * @description: 请求函数封装，核心方法
   * @param method {String} 请求方法
   * @param path {String} 接口路径
   * @param params {Object} 请求参数
   * @param config {Object} 其他参数参数
   * @return: Promise
   */

  _fetch(method, path, params, { ...config }) {
    const { UID = '' } = sessionStorage
    // 组装请求参数
    const data = { ...params, uid: UID }
    // 给请求参数加签名
    const formatData = this._formatAndSignData(method, data)
    // 组装发起请求的 formData
    const formData = {
      ...GET_BASE_REQUEST_PARAMS(formatData),
      ...formatData,
      method,
      url: path,
    }
    // 是否返回全部响应数据
    const { returnFullData } = config
    return new Promise((resolve, reject) => {
      this._axiosInstance(formData).then((response) => {
        // 对响应的 status 做校验
        if (response.status >= 200 && response.status <= 300) {
          // 处理成功的请求
          if (Number(response.data.code) === 0) {
            if (returnFullData) {
              return resolve(response.data)
            }
            return resolve(response.data.data)
          }
        }
        return reject(response)
      })
    })
  }

  /**
   * @description: GET 方法
   * @param {type}
   * @return:
   */

  get(path, params, { ...config }) {
    return this._fetch('GET', path, params, { ...config })
  }

  /**
   * @description: POST 方法
   * @param {type}
   * @return:
   */

  post(path, params, { ...config }) {
    const { showLoading = true } = params
    this._showLoading = showLoading
    return this._fetch('POST', path, params, { ...config })
  }
}

export default HttpRequest
