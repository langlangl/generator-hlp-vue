/**
 * @description: 原生SDK事件中心 : 单例模式
 * 独立蠢
 */
import { UserRegist } from './../api/javaApi'
import Track from '../utils/track.js'
const FAKE_USER_INFO = {
  app: {
    appv: '1.0',
    bundle: 'com.btiming.demo',
    id: 101,
    key: 'qO7sHWMW1vH8RqTFooi6VuPdqs2MhqWv',
    lang: 'in',
    origin: 'http://101.251.197.221',
    sdkv: '1.1.1',
  },
  bfs: {
    androidId: "06b5c30eb7a6a3a6",
    appk: "qO7sHWMW1vH8RqTFooi6VuPdqs2MhqWv",
    appv: "1.0",
    battery: 86,
    brand: "samsung",
    btch: 1,
    btime: 1616428459747,
    bundle: "com.btiming.demo",
    carrier: "",
    contype: 2,
    did: "b70a425c-34dd-4d71-a6b5-f91469161f2d",
    dtype: 2,
    fbid: "790dace4-7078-4157-bb5d-108f17d5c670",
    fit: 1614845295,
    flt: 1615298698,
    fm: 8929,
    h: 2076,
    jb: 0,
    lang: "zh",
    lcountry: "CN",
    lowp: 0,
    make: "samsung",
    mccmnc: "46001",
    model: "SM-G960U",
    organic: 1,
    os: 1,
    osv: "9",
    ram: 3755982848,
    sdkv: "1.2.7",
    serial: "unknown",
    ts: 1616501946380,
    uuid: "u68-17bd9ea2-e01a-4bad-87b8-aa468524573b",
    w: 1080,
    zo: 480
  },
  pos:{
    crps:{
      opentype:"limit",
      sourceType:"Japan",
      selectedName:"Japan"

    }
  },
  ecData:{
      best: "http://101.251.197.221",
      origin: ["http://101.251.197.221"],
      svr: ["http://101.251.197.221"],
      testing: true
    },
  device: {
    uuid: 'u68-17bd9ea2-e01a-4bad-87b8-aa468524572d',
    did: 'b2799230-6d70-481a-9703-6e454a8a1f14',
    country: 'IN',
  },
} // dev环境下模拟用户信息
const isDev = process.env.NODE_ENV === 'development'

class NativeSdk {
  constructor(needRegist = false) {
    this._config = { needRegist } // 基础配置
    this._sdkInfo = null
    this._eventcallbacksInBusiness = new Map()
    this._strategyCallback = null
    this._init()
  }
  /*************************************************** 私有函数开始 ************************************************************/

  /**
   * @description: 初始化
   * @param {}
   * @return:void
   */
  _init() {
    // const { needRegist, useStrategy } = this._config
    this._createdShowInitEventListener()
    this._createdSdkInitEventListener()
  }
  // 创建 init 事件监听器
  _createdSdkInitEventListener() {
    const adSdk = window.AdSDK
    if (!adSdk) {
      console.error('window.AdSDK尚未就绪')
      return
    }
    if (isDev) {
      this._sdkInfo = FAKE_USER_INFO
      setTimeout(() => {
        this._initEventCallback(FAKE_USER_INFO)
        this._showEventCallback(FAKE_USER_INFO)
      }, 200)
      window.AdSDK.init()
      return
    }
    adSdk.addEventListener('init', (e) => {
      console.log('来自sdk-init事件的监听打印', e)
      this._sdkInfo = e
      this._initEventCallback(e)
    })
    // adSdk.init()
  }
  // 创建 init 事件监听器
  _createdShowInitEventListener() {
    window.AdSDK.addEventListener('show', (e) => {
      console.log('来自sdk-show事件的监听打印', e)
      Track.trackEvent({ev: 'ec_show'})
      this._showEventCallback(e)
    })
  }
  // 创建 show 事件监听器
  _showEventCallback(info) {
    this._executeEventCallback('show', info)
  }
  // sdk-init事件监听回调
  _initEventCallback(info) {
    const {
      device: { uuid },
    } = info
    if (uuid) {
      info.UID = uuid
      info.SDKUID = uuid
    }
    const newInfo = { ...info }
    const { needRegist } = this._config

    this.setInSessionStorage(newInfo)
    if (needRegist.needRegist) this._registInSever(newInfo)
    this._executeEventCallback('init', newInfo)
  }
  // 使用注册服务端注册信息
  async _registInSever(info) {
    console.log('请求 注册接口 -----')
    const {
      device: { country },
      app: { lang },
      bfs: { zo: timeZone },
      SDKUID: sid,
    } = info
    const { uid: UID, token: Token } = await UserRegist({
      sid,
      timeZone,
      country,
      lang,
    })
    this.setInSessionStorage({ UID, Token })
    // 获取完用户信息，通知 SDK 已经注册
    window.AdSDK.postMessage(JSON.stringify({ isRegister: true }), '*')
    this._executeEventCallback('afterRegist', { uid: UID, token: Token })
  }

  // 遍历执行当前事件回调
  _executeEventCallback(eventName, info = null) {
    const cacheEventList = this._eventcallbacksInBusinessSortByType({
      eventName,
    })
    if (cacheEventList && cacheEventList.length) {
      cacheEventList.forEach((callback) => {
        callback(info)
      })
    }
  }
  // 根据不同类型排序
  _eventcallbacksInBusinessSortByType(type) {
    const { eventName: useEventName, componentName: useComponentName } = type
    const usingTypeName = useEventName ? 'eventName' : 'componentName'
    const usingType = useEventName || useComponentName
    const callbacks = []
    this._eventcallbacksInBusiness.forEach((value, key) => {
      const newKey = JSON.parse(key)
      if (newKey[usingTypeName] === usingType) {
        callbacks.push(value)
      }
    })
    return callbacks.length > 1
      ? callbacks
          .sort((a, b) => b.weight - a.weight)
          .map((value) => value.callback)
      : callbacks.map((value) => value.callback)
  }
  // 监测是否存在重复注册
  _checkSetEventHasKey(key) {
    return !!this._eventcallbacksInBusiness.get(key)
  }
  /*************************************************** 私有函数结束 ************************************************************/
  // 注册事件回调
  setEventCallback(componentName, eventName, callback, weight = 1) {
    const key = JSON.stringify({ componentName, eventName })
    if (this._checkSetEventHasKey(key)) {
      console.error('存在重复的组件-事件名注册')
      return
    }
    this._eventcallbacksInBusiness.set(key, { callback, weight })
  }
  // 注册监听
  createdSdkEventListeners(eventNames) {
    if (Object.prototype.toString.call(eventNames) !== '[object Array]') {
      console.error('接收参数类型必须为数组！')
      return
    }
    eventNames.forEach((eventName) => {
      window.AdSDK.addEventListener(eventName, (e) => {
        this._executeEventCallback(eventName, e)
      })
    })
  }

  // 信息本地化存储(bfs,app,device,SDKUID,appLang,strategy,ecData:开发环境下没有)
  setInSessionStorage = (info) => {
    Object.keys(info).forEach((key) => {
      const value = info[key]
      if (typeof value === 'object') {
        sessionStorage.setItem(key, JSON.stringify(value))
      } else {
        sessionStorage.setItem(key, value)
      }
    })
  }
}
// const nativeSdk = new NativeSdk({
//   needRegist: true,
// })

export default NativeSdk
