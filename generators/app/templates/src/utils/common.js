import { Toast } from 'vant';
import 'vant/lib/toast/style';
import Track from '@/utils/track'
import store from '@/vuex/store'
let toast;
/**
 * 
 * @param {*} str 
 */
export const getHashCode = (str) => {
    let hash = 0; // 获取哈希值
    let i;
    let chr;
    let len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i += 1) {
        chr = str.charCodeAt(i);
        // eslint-disable-next-line no-bitwise
        hash = (hash << 5) - hash + chr;
        // eslint-disable-next-line no-bitwise
        hash |= 0;
    }
    hash = Math.abs(hash);
    hash %= 100;
    // A1:[0,25) A2:[25,50) B1:[50,75) B2:[75,100)
    return hash >= 50 ? 'B' : 'A';
  
};

export const guid =()=>{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

export const getUrlParams =(name)=>{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = decodeURI(window.location.search).substr(1).match(reg);
    if(r!=null) return  r[2]; return null;
}

/**
 * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
 * @return {function}             返回客户调用函数
 */

export const debounce = (func, wait, immediate,info) => {
  let timer;
  let context;
  let args;
  // let toast = null;

  // 延迟执行函数
  const later = () =>
      setTimeout(() => {
          // 延迟函数执行完毕，清空缓存的定时器序号
          timer = null;
          // 延迟执行的情况下，函数会在延迟函数中执行
          // 使用到之前缓存的参数和上下文
          if (!immediate) {
              if (toast) {
                  toast.clear();
              }
              func.apply(context, args);
              // eslint-disable-next-line no-multi-assign
              context = args = null;
          }
      }, wait);

  // 这里返回的函数是每次实际调用的函数
  // eslint-disable-next-line func-names
  return function (...params) {
      // 如果没有创建延迟执行函数（later），就创建一个
      if (!timer) {
          timer = later();
          // 如果是立即执行，调用函数
          // 否则缓存参数和调用上下文
          if (toast) {
              console.log('toast.clear()');
              toast.clear();
          }
          if (immediate) {
              console.log("immediate==")
              func.apply(this, params);
          } else {
              context = this;
              args = params;
          }
          // 如果已有延迟执行函数（later），调用的时候清除原来的并重新设定一个
          // 这样做延迟函数会重新计时
      } else {
        let tips = info ? info : "Tap too fast"
          toast = Toast({
              message:tips,
              duration: 1500,
          });
          clearTimeout(timer);
          timer = later();
      }
  };
};


//节流函数
export const throttle = (fn,wait) =>{
    var timer = null;
    return function(){
        var context = this;
        var args = arguments;
        if(!timer){
            timer = setTimeout(function(){
                fn.apply(context,args);
                timer = null;
            },wait)
        }
    }
}
//版本号判断
export const compareVersion = (v1, v2) => {
    if (v1 == v2) {
      return 0;
    }
    const vs1 = v1.split(".").map(a => parseInt(a));
    const vs2 = v2.split(".").map(a => parseInt(a));
    const length = Math.min(vs1.length, vs2.length);
    for (let i = 0; i < length; i++) {
      if (vs1[i] > vs2[i]) {
        return 1;
      } else if (vs1[i] < vs2[i]) {
        return -1;
      }
    }
  
    if (length == vs1.length) {
      return -1;
    } else {
      return 1;
    }
  }

export const parallelDownload = (source,pageTitle,flag)=>{
    store.commit('setLoading', true)
    const { device } = sessionStorage
    console.log(device,"device==")
    const d = JSON.parse(device)
    const time = new Date().getTime()
    const openType  = store.state.openType
    const did = store.state.did
    const bundle = store.state.bundle
    const sourceType = store.state.info[store.state.activeIndex].name
    const pos = store.state.pos
    if(d.country != 'IN'){
      const url = window.dailyVideo+"?opentype="+openType+"&did="+did+"&source="+source+"&bundle="+bundle+"&ts="+time+"&sourceType="+sourceType
      const url1 =window.jumpUrl+"?dataPageTitle="+sourceType+"&dataElementName="+source+"&dataRemarks=&url="+encodeURIComponent(url)+"&bundle="+bundle+"&did="+did+"&mpid="+pos.mpid+"&pos="+pos.id+"&crid="+pos.crid+"&cpid="+pos.cpid
      window.AdSDK.openBrowser(url1);
      return;
    }
    if(!flag){
        Track.trackEvent({
            ev: source,
            remarks: '',
            elementName:openType+"-"+sourceType,
            pageTitle: pageTitle,
          })
    }
      let value = ""
      store.state.positionUrl.some(res=>{
          if(res.key == source){
              value = res.value
          }
      })
    if(store.state.isNew != -1){//是否是新的   是   并行
        const url = window.webUrl+"?opentype="+openType+"&did="+did+"&source="+source+"&bundle="+bundle+"&ts="+time+"&sourceType="+sourceType
        const url1 =window.jumpUrl+"?dataPageTitle="+sourceType+"&dataElementName="+source+"&dataRemarks=&url="+encodeURIComponent(url)+"&bundle="+bundle+"&did="+did+"&mpid="+pos.mpid+"&pos="+pos.id+"&crid="+pos.crid+"&cpid="+pos.cpid
        window.AdSDK.openBrowser(url1,{
            "landUrl": window.webUrl,
            "trackerUrl":value
          })
    }else{
        window.AdSDK.openBrowser(value)
    }
}

export const jumpOfferWall = (source)=>{
  console.log(source,"source==")
  const result = compareVersion(store.state.sdkv,process.env.VUE_APP_ADK_OFFERWALL_VERSION)
  if(result == -1){
    window.vm.$router.push({
      path:`/IntegralWall`,
      query:{
        source:source
      }
    })
  }else{//新的
    console.log(window.AdSDK.OfferWall.isReady(),"window.AdSDK.OfferWall.isReady==")
    if(!window.AdSDK.OfferWall.isReady()){
      Toast({
          message:"The page is preparing, please wait...",
          duration: 1500,
      });
      Track.trackEvent({
        ev: "OfferWallIsNotReady",
        remarks: '',
        elementName:"",
        pageTitle: "singleVideoPage",
      })
      return;
    }
    window.AdSDK.OfferWall.showAd(source)
    
  }
}