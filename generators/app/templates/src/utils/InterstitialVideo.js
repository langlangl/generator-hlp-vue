/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/*
 * @Description: 激励视频调度中心：所有激励视频统一在这里实现加载，播放，以及异常情况处理
 */
// import env from './env'
import Track from './track'
import { Toast } from 'vant'
import 'vant/lib/toast/style';

// 初始化视频信息
const EVENT_NAME_MAP_FUNNAME = {
  availabilityChanged: 'onAvailabilityChanged',
  show: 'onShow',
  showFailed: 'onShowFailed',
  started: 'onStarted',
  ended: 'onEnded',
  close: 'onClose',
  rewarded: 'onRewarded',
  click: 'onClick',
}
// 激励视频执行过程：
// 1.初始化时实例所有监听事件，以任务ID作为映射标记，来实现对应不同视频任务的回调函数
class RewardVideo {
  constructor() {
    this.rewardedVideo = null
    this.eventCallbackMap = {}
    this.trackAd = {
      type: '插屏广告',
      pos: '',
    }
    this.triggerRewardEvent = {
      isTrigger: false,
      event: null,
    }
    this.isPlayingAdVideo = false
    this._init()
    return this._createdVideo.bind(this)
  }

  /* -------------------------------------------- 私有方法开始 ------------------------------------ */
  /**
   * @description: 初始化
   * @param {}
   * @return: void
   */
  _init() {
    if (!window.AdSDK) {
      console.error('当前环境没有AdSDK对象，无法进行激励视频初始化！')
      return
    }
    // eslint-disable-next-line no-unreachable
    const { InterstitialAd } = window.AdSDK
    this.rewardedVideo = InterstitialAd
    this._addEventListeners()
  }

  /**
   * @description: 初始化激励视频对象
   * @param {}
   * @return: void
   */
  _createdVideo(hookFuns) {
    console.log(hookFuns,"===hookFuns===")
    // const isReady = this._checkConfigs(info)
    // if (!isReady) return
    // const { taskId } = info
    const { type = '插屏广告', pos = '' } = hookFuns
    this.eventCallbackMap = { ...hookFuns }
    this.trackAd = { ...this.trackAd, type, pos }
    this._playVideo()
  }

  /**
   * @description: 创建监听事件
   * @param {}
   * @return: void
   */
  _addEventListeners() {
    Object.keys(EVENT_NAME_MAP_FUNNAME).forEach((eventName) => {
      this.rewardedVideo.addEventListener(eventName, (e) => {
        let evAndMsg = {
          ev: eventName,
        }
        // 获取当前会被触发的事件名称
        const callbackFunName = EVENT_NAME_MAP_FUNNAME[eventName]
        const callback = this.eventCallbackMap[callbackFunName]

        switch (eventName) {
          case 'rewarded':
            this._onRewardedEvent(e)
            break
          // case 'close':
          //   this._onCloseEvent()
          //   break
          case 'showFailed':
            // this.rewardedVideo.showClose()
            this.isPlayingAdVideo = false
            evAndMsg = { ...evAndMsg, msg: e.ms }
            
            break
          default:
            if (
              Object.prototype.toString.call(callback) === '[object Function]'
            ) {
              callback(e);
              if(eventName ==  'close') this.isPlayingAdVideo = false
            }
            break
        }
        // 激励视频埋点
        this._postADFunnelEvent(evAndMsg)
      })
    })
  }

  /**
   * @description: 奖励发放回调函数
   * @param {event}
   * @return:void
   */
  _onRewardedEvent(event) {
    console.log('执行视频播放-标记奖励回调-已发放')
    this.triggerRewardEvent = {
      isTrigger: true,
      event,
    }
  }

  /**
   * @description: 关闭视频回调函数
   * @param {}
   * @return:void
   */
  _onCloseEvent() {
    console.log('执行视频播放-_onCloseEvent事件')
    this.isPlayingAdVideo = false
    const { isTrigger, event } = this.triggerRewardEvent
    if (isTrigger) {
      console.log('执行视频播放-执行奖励回调')
      if (this.eventCallbackMap.onRewarded)
        this.eventCallbackMap.onRewarded(event)
    }
    this.triggerRewardEvent.isTrigger = false
    
  }

  /**
   * @description: 监测配置配置参数正确性
   * @param {info}
   * @return: void
   */
  // eslint-disable-next-line class-methods-use-this
  _checkConfigs(info) {
    if (Object.prototype.toString.call(info) !== '[object Object]') {
      console.error('第一个参数必须是对象！')
      return false
    }
    if (!Object.keys(info).length) {
      console.error('对象必须包含属性taskId两个属性！')
      return false
    }
    if (!Object.hasOwnProperty.call(info, 'taskId')) {
      console.error('对象必须包含属性taskId两个属性！')
      return false
    }
    return true
  }

  /**
   * @description: 开始播放
   * @param {}
   * @return: void
   */
  _playVideo() {
    console.log("=====")
    if (!this.rewardedVideo.isReady()) {
      Toast('Try again later!')
      console.log("插屏广告未准备好")
      // return
    }
    else if (this.rewardedVideo.isReady() && !this.isPlayingAdVideo) {
      console.log("插屏广告开始播放了")
      this.isPlayingAdVideo = true
      this.rewardedVideo.showAd('DS')
    }
  }

  /**
   * @description: 埋点
   * @param {}
   * @return: void
   */
  _postADFunnelEvent({ ev, ms }) {
    const event = {
      ...this.trackAd,
      stage: ev,
      msg: ms,
    }
    Track.adFunnelEvent(event)
  }

  /* -------------------------------------------- 私有方法结束 ------------------------------------ */
}

const video = new RewardVideo()
export default video
