/* eslint-disable no-underscore-dangle */
/*
 * @Author: Kuaiyin FE
 * @Date: 2020-07-12 02:13:05
 * @Description: 设备识别工具类
 * @FilePath: /bt-game/src/util/env.js
 */
/**
 * @description: 当前 H5页 运行环境判断：客户端 || 系统
 * @param {}
 * @return: void
 */

class Environment {
  constructor() {
    this._ua = navigator.userAgent // 内核代理名称
    // 对外暴露属性
    this.system = ''
    this.client = ''
    this._init()
  }

  _init() {
    this.getSystem()
    this.getClient()
  }

  // QQ客户端
  _isQQClient() {
    const { _ua } = this
    const isIosQQ =
      /iPad|iPhone|iPod/.test(_ua) && !window.MSStream && /\sQQ/i.test(_ua)
    const isAndroidQQ =
      /(Android)/i.test(_ua) &&
      /MQQBrowser/i.test(_ua) &&
      /\sQQ/i.test(_ua.split('MQQBrowser'))
    return isIosQQ || isAndroidQQ
  }

  // 微信客户端
  _isWechatClient() {
    const { _ua } = this
    return /micromessenger/i.test(_ua)
  }

  // 是否是安卓系统
  _isAndroidSystem() {
    const { _ua } = this
    return /android/i.test(_ua)
  }

  // 是否是苹果系统
  _isIosSystem() {
    const { _ua } = this
    return /iPad|iPhone|iPod/.test(_ua) && !window.MSStream
  }

  /**
   * @description: 获取系统名称
   * @param {type}
   * @return:
   */

  getSystem() {
    if (this._isIosSystem()) {
      this.system = 'iOS'
      return
    }
    if (this._isAndroidSystem()) {
      this.system = 'Android'
    }
  }

  // 获取所在客户端名称
  getClient() {
    if (this._isQQClient()) {
      this.client = 'QQ'
      return
    }
    if (this._isWechatClient()) {
      this.client = 'Weixin'
    }
  }
}

const env = new Environment()

export default env
