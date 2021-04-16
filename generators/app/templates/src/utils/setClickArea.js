/**
 * @description 设置可点击区域 window.AdSDK.setInterceptAreas
 */

const getType = (arg) => {
  return Object.prototype.toString.call(arg)
}
class ClickArea {
  constructor() {
    this._enableClickAreaList = new Map() // 可点击区域
    this._cacheUnableClickAreaList = new Map() // 临时缓存区域
    this._currentMod = 'normal' // 当前模式，如果触发modal类型，不在设置可点击区域，只是针对不模块做监听事件处理
    this.modal = {
      setAreas: this._setModal.bind(this),
      removeAreas: this._removeModal.bind(this),
    }
    return this._init()
  }
  // 初始化
  _init() {
    return this
  }
  // 设置可点击区域
  set(areaslist = []) {
    if (
      getType(areaslist) !== '[object Array]' &&
      getType(areaslist) !== '[object Object]'
    ) {
      console.error('参数类型必须为数组或者对象！')
    }
    let _areaslist =
      getType(areaslist) === '[Object Object]' ? [areaslist] : [...areaslist]
    _areaslist = _areaslist
      .map((area) => {
        const { width, height, left, top } = area.dom.getBoundingClientRect()
        return [
          area.dom,
          {
            cache: area.cache || true,
            listenerCallback: (e) => {
              area.callback && area.callback()
              e.stopPropagation()
            },
            hasAddListener: false,
            rect: { width, height, left, top },
          },
        ]
      })
      .reduce(
        (result, cur) => {
          const { cache } = cur[1]
          const listName = cache ? 'cacheList' : 'uncacheList'
          result[listName].push(cur)
          return result
        },
        {
          cacheList: [],
          uncacheList: [],
        }
      )
    this._enableClickAreaList = new Map([
      ..._areaslist.cacheList,
      ...this._enableClickAreaList,
      ..._areaslist.uncacheList,
    ]) //合并，并且覆盖掉相同domName，所以dom必须保持唯一性
    this._setEventListeners()
  }
  // 穿插监听器
  _setEventListeners() {
    // 遍历找出需要装载监听器的模块
    this._enableClickAreaList = [...this._enableClickAreaList].map((item) => {
      const key = item[0]
      const value = item[1]
      const { listenerCallback, hasAddListener } = value
      if (!hasAddListener && key) {
        //没有监听器，安插
        key.addEventListener('click', listenerCallback)
        value.hasAddListener = !value.hasAddListener
      }
      return item
    })
    this._enableClickAreaList = new Map(this._enableClickAreaList)
    this._setAreasInSdk()
    console.log(this._enableClickAreaList)
  }
  // 移除
  remove(areaslist = []) {
    if (
      getType(areaslist) !== '[object Array]' &&
      getType(areaslist) !== '[object Object]'
    ) {
      console.error('参数类型必须为数组或者对象！')
    }
    let _areaslist =
      getType(areaslist) === '[Object Object]' ? [areaslist] : [...areaslist]

    _areaslist.forEach((area) => {
      const { dom } = area
      const hasValue = this._enableClickAreaList.get(dom)
      if (hasValue) {
        dom.removeEventListener('click', hasValue.listenerCallback)
        this._enableClickAreaList.delete(dom)
      }
    })
    this._setAreasInSdk()
  }
  // 全部移除
  removeAll() {
    this._enableClickAreaList.forEach((value, key) => {
      key.removeEventListener('click', value.listenerCallback)
    })
    this._enableClickAreaList.clear()
    this._setAreasInSdk()
  }
  // 设置模态框场景
  _setModal(areaslist = []) {
    this._currentMod = 'modal'
    this._cacheUnableClickAreaList = this._enableClickAreaList //保存临时缓存
    this._enableClickAreaList = new Map()
    this.set(areaslist)
  }
  _removeModal() {
    this._currentMod = 'normal'
    this.removeAll()
    this._enableClickAreaList = this._cacheUnableClickAreaList
    this._setEventListeners() // 缓存区域重新写入
    this._cacheUnableClickAreaList = new Map()
  }
  // 设置区域
  _setAreasInSdk() {
    if (this._currentMod === 'modal') {
      console.log('弹窗场景-------全区域覆盖')
      window.AdSDK &&
        window.AdSDK.setInterceptAreas([
          {
            top: 0,
            left: 0,
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
          },
        ])
      return
    }
    let setList = []
    this._enableClickAreaList.forEach((value) => {
      const { rect } = value
      setList.push(rect)
    })
    if (!setList.length) {
      setList = [{ width: 0, height: 0, left: 0, top: 0 }]
    }
    console.log('穿透区域指定-----', setList)
    window.AdSDK && window.AdSDK.setInterceptAreas([...setList])
  }
}
const clickArea = new ClickArea()
// clickArea.set([
//   {
//     dom: { foo: 1 },
//     callback: () => {},
//     cache: true, // 是否缓存该区域：缓存后如果dom再次被加入，callback事件并不会被覆盖。
//   },
//   {
//     dom: { foo: 2 },
//     callback: () => {},
//     cache: true, // 是否缓存该区域
//   },
// ])
// clickArea.set([
//   {
//     dom: { foo: 3 },
//     callback: () => {},
//     cache: true, // 是否缓存该区域：缓存后如果dom再次被加入，callback事件并不会被覆盖。
//   },
// ])
// clickArea.remove([dom])
// clickArea.remove('domName')
// clickArea.removeAll()

// // // 模态框类型封装
// console.log('clickArea.modal', clickArea.modal)
// clickArea.modal.setAreas([]) // 默认设置全区域为非透传，为指定区域圈出可用范围，将之前的可点击区域临时推出缓存区间。
// clickArea.modal.remove() // 移除模态框所有相关区域，恢复之前点击区域。
export default clickArea
