// AdSDK 
(function (win, doc) {
    // eslint-disable-next-line no-mixed-operators
    const __version__ = '2.1.4';
    const { sdk } = win.webkit && win.webkit.messageHandlers || win
    const postMessage = o => {
        if (AdSDK.debug) {
            console.log(JSON.stringify(o));
        }
        o.jsv = __version__;
        sdk && sdk.postMessage(JSON.stringify(o))
    }
    /**
     * 记录错误信息
     */
    win.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber) {
        postMessage({
            "m": 'sendTrackEvent',
            "d": {
                "tid": "js",
                "event": "js_error",
                "data": { "error": errorMessage, "referrer": scriptURI, "content": 'line:' + lineNumber + ',column:' + columnNumber }
            }
        });
    };
    /**
     * @typedef {Object} AdEvent
     * @property {string} type - Event Type/Name
     * @property {number} pid - placementID
     * @property {string} adType - 广告位类型[video,interstitial]
     * @property {string} sceneName
     * @property {boolean} ready - availabilityChanged
     * @property {number} code - error code
     * @property {string} msg - error msg
     */

    /**
     * InterstitialAd
     */
    const InterstitialAd = {
        /**
         * @private {boolean} AdReadyState
         */
        _ready: false,

        /**
         * @private {EventTarget} _et
         */
        _et: doc.createElement('a'),

        /**
         * @private {boolean} 是否要处理 AdShow 之后相关的 Ad 事件
         */
        _myAd: false,

        /**
         * 添加事件监听器
         * @param {string} type - 事件名
         * @param {EventListener} listener - 回调方法
         * @param {?(boolean | AddEventListenerOptions)} options
         */
        addEventListener(type, listener, options) {
            this._et.addEventListener(type, listener, options)
        },
        /**
         * 移除事件监听器
         * @param {string} type - 事件名
         * @param {EventListener} listener - 回调方法
         * @param {?(boolean | EventListenerOptions)} options
         */
        removeEventListener(type, listener, options) {
            this._et.removeEventListener(type, listener, options)
        },
        /**
         * 检查广告库存状态
         * @returns {boolean} - true:Ready, false:NotReady
         */
        isReady() {
            return this._ready
        },
        /**
         * 全屏展示视频广告
         * @param {string} sceneName - 场景名, 必传
         */
        showAd(sceneName) {
            this._myAd = true
            postMessage({
                m: 'showAd',
                d: {
                    adType: 'interstitial',
                    sceneName
                }
            })
        }
    }

    /**
     * RewardedVideo
     */
    const RewardedVideo = Object.assign({}, InterstitialAd, {
        _et: doc.createElement('a'),
        /**
         * 积分墙
         * @param {string} sceneName - 场景名, 非必传
         */
        showAd(sceneName) {
            this._myAd = true
            postMessage({
                m: 'showAd',
                d: {
                    adType: 'video',
                    sceneName,
                    extID
                }
            })
        }

    });
    /**
     * RewardedVideo
     */
     const OfferWall = Object.assign({}, InterstitialAd, {
        _et: doc.createElement('a'),
        /**
         * 全屏展示视频广告
         * @param {string} extID
         * @param {string} sceneName - 场景名, 非必传
         */
        showAd(sceneName) {
            console.log(sceneName,"sceneName==")
            this._myAd = true
            postMessage({
                m: 'showAd',
                d: {
                    adType: 'offerwall',
                    sceneName
                }
            })
        }

    });
    /**
     * WebView操作，可以指定id来创建新的webview，id可以不指定，默认为0，格式为正整数
     */
    const WebView = {
        /**
         * 预加载一个webview，如果指定的id，会按这个id新建一个webview进行管理，所以使用完后一定要调用close关闭
         * webview默认为隐藏状态，需要调用show进行显示
         * @param {string} url 加载的地址
         * @param {int} pid pos的id，可以为空，默认为当前的pos
         * @param {int} id webview的id，可以为空，默认为0
         */
        loadURL(url, pid, id) {
            postMessage({
                m: 'loadWv',
                d: { "url": url, "id": id ? id : 0, "pid": pid }
            })
        },
        /**
         * 显示一个webview，可以指定id显示特定的webview。
         * @param {int} id webview的id，可以为空，默认为0
         */
        show(id) {
            postMessage({
                m: 'showWv',
                d: { "id": id ? id : 0 }
            })
        },
        /**
         * 关闭一个webview，并清理资源，可以指定id进行关闭。
         * @param {int} id webview的id，可以为空，默认为0
         */
        close(id) {
            postMessage({
                m: 'closeWv',
                d: { "id": id ? id : 0 }
            })
        },
        /**
         * 隐藏一个webview，且可以指定id进行隐藏
         * @param {int} id webview的id，可以为空，默认为_default
         */
        hide(id) {
            postMessage({
                m: 'hideWv',
                d: { "id": id ? id : 0 }
            })
        }
    }
    /**
     * 点击区域管理
     */
    const InterceptAreas = {
        /**
         * 增加点击区域
         * 
         * @param {object[]} param 
         * 
         * param参数示例
         * 
         * [
         *     {
         *         "key": "key1",
         *         "rect": {
         *             "left": 100.0,
         *             "top": 100.0,
         *             "width": 100.0,
         *             "height": 100.0
         *         }
         *     },
         *     {
         *         "key": "key2",
         *         "rect": {
         *             "left": 100.0,
         *             "top": 100.0,
         *             "width": 100.0,
         *             "height": 100.0
         *         }
         *     }
         * ]
         * 
         */
        add(param) {
            postMessage({ m: 'addInterceptAreas', d: { "rects": param } });
        },
        /**
         * 删除点击区域
         * @param {object[]} param 
         * 
         * param参数示例
         * [
         *     "key1",
         *     "key2"
         * ]
         * 
         */
        remove(param){
            postMessage({ m: 'removeInterceptAreas', d: { "rects": param } });
        }
    }
    /**
     * 初始化信息
     */
    const initData = { lazy: {} };
    /**
     * sdk主体
     */
    const AdSDK = {
        /**
         * 激励视频管理
         */
        RewardedVideo,
        /**
         * 插屏广告管理
         */
        InterstitialAd,
        /**
         * webview管理
         */
        WebView,
        /**
         * 积分墙
         */
        OfferWall,
        /**
         * 可点击区域
         */
        InterceptAreas,
        /**
         * 调试开关
         */
        debug: false,
        /**
         * 通用信息
         */
        get bfs() {
            return initData.bfs
        },
        /**
         * app信息
         */
        get app() {
            return initData.app
        },
        /**
         * 设备信息
         */
        get device() {
            return initData.device
        },
        /**
         * 入口信息
         */
        get pos() {
            return initData.pos
        },
        /**
         * 延迟加载资源
         */
        get lazy() {
            return initData.lazy
        },

        /**
         * 当前窗口的参数
         */
        get ecData() {
            return initData.ecData
        },
        /**
         * 埋点事件上报
         */
        get posTrace() {
            return positionEvent;
        },
        _et: doc.createElement('a'),
        /**
         * 增加监听事件
         * @param {string} type 
         * @param {*} listener 
         * @param {*} options 
         */
        addEventListener(type, listener, options) {
            this._et.addEventListener(type, listener, options)
        },
        /**
         * 删除监听事件
         * @param {string} type 
         * @param {*} listener 
         * @param {*} options 
         */
        removeEventListener(type, listener, options) {
            this._et.removeEventListener(type, listener, options)
        },
        /**
         * 调用初始化完成事件
         */
        init() {
            postMessage({ m: 'jsLoaded' })
        },
        /**
         * 发送埋点事件
         * @param {object} e 
         */
        sendTrackEvent(e) {
            postMessage({
                m: 'sendTrackEvent',
                d: e
            })
        },
        /**
         * 打开一个EndCard窗口
         * @param {int} id endcard的id
         * @param {int} pid pos的id
         */
        openEc(id, pid) {
            postMessage({ m: 'openEc', d: { "id": id ? id : 0, "pid": pid } });
        },
        /**
         * 隐藏系统的关闭按钮
         */
        hideClose() {
            postMessage({ m: 'hideClose' });
        },
        /**
         * 显示系统的关闭按钮
         */
        showClose() {
            postMessage({ m: 'showClose' });
        },
        /**
         * 重新加载当前窗口
         */
        reload() {
            postMessage({ m: 'reload' });
        },
        /**
         * 关闭窗口或入口，可以指定入口的key
         * 
         * @param {string} key 
         * @param {object} param
         */
        close(key, param) {
            postMessage({ m: initData.isEc ? 'closeEc' : 'closePos' });
            AdSDK.posTrace.close(key, param);
        },
        /**
         * 处理点击事件
         * @param {string} key
         * @param {object} param
         */
        click(key, param) {
            key = key ? key : '_default';
            let pos = AdSDK.lazy[key];
            if (pos) {
                var url = pos.ecurl;
                if (url && url.indexOf('{') != -1) {
                    url = url.replace('{crid}', pos.crid);
                    url = url.replace('{posid}', pos.id);
                    url = url.replace('{uuid}', AdSDK.bfs.uuid);
                    url = url.replace('{did}', AdSDK.bfs.did);
                    url = url.replace('{dtype}', AdSDK.bfs.dtype);
                    url = url.replace('{lang}', AdSDK.bfs.lang);
                    url = url.replace('{bundle}', AdSDK.bfs.bundle);
                    url = url.replace('{ecid}', pos.ecid);
                    url = url.replace('{mpid}', pos.mpid);
                }
                switch (pos.ectype) {
                    case 0:
                        AdSDK.openEc(pos.ecid, pos.id);
                        break;
                    case 1:
                        AdSDK.openBrowser(url);
                        break;
                    case 2://gp
                        AdSDK.openBrowser(url);
                        break;
                    case 3://
                        AdSDK.WebView.loadURL(url, pos.id);
                        AdSDK.WebView.show(0);
                        break;
                    case 4://
                        AdSDK.openBrowser(url);
                        break;
                }
                AdSDK.posTrace.click(key, param);
            }
        },

        /**
         * 发消息给其它webview
         * @param {string} message 
         * @param {string} target 
         * @param {*} targetId 
         */
        postMessage(message, target = '*', targetId = 0) {
            postMessage({
                m: 'postMessage',
                d: {
                    message,
                    target,
                    targetId
                }
            });
        },
        /**
         * 打开浏览器
         * @param {string} url
         * @param {object} param
         */
        openBrowser(url,param) {
            postMessage({
                m: 'openBrowser',
                d: { url ,param}
            });
        },
        /**
         * 设计可操作区域
         * @param {object}} rects 
         */
        setInterceptAreas(rects) {
            postMessage({
                m: 'setInterceptAreas',
                d: { rects }
            })
        },
        /**
         * 打开游戏页面用
         */
        openView(url) {
            if (win.openViewing) {
                return false
            }
            win.openViewing = true;

            const f = doc.createElement('iframe');
            const { body } = doc;

            const close = doc.createElement('div');
            close.classList.add('close', 'x');
            const width = 30;
            const halfWidth = Math.round(width / 2);
            const borderWidth = Math.round(width / 3);
            const style = doc.createElement('style');
            style.setAttribute('scoped', 'true');
            style.innerText = `.close{z-index:9919;display:flex;left:unset;right:${borderWidth}px;transition: opacity 2s;width:${width}px;height:${width}px;position:absolute;top:${borderWidth}px;border-radius:50%;background-color:#333;opacity:.6;justify-content:center;align-items:center;border:${borderWidth}px solid transparent;background-clip:padding-box;box-sizing:unset}.close span{color:#fff;font-size:${halfWidth}px}.close.x::after,.close.x::before{content:" ";width:70%;height:1px;background:#fff;position:absolute;top:50%}.close.x::before{transform:rotate(45deg)}.close.x::after{transform:rotate(-45deg)}`
            close.appendChild(style);

            body.appendChild(f);
            body.appendChild(close);

            close.addEventListener('click', e => {
                e.preventDefault();
                win.openViewing = false;
                f.remove();
                close.remove();
                const ev = doc.createEvent('Event');
                ev.initEvent("viewClose", true, false);
                win.AdSDK._et.dispatchEvent(ev);
                win.AdSDK.sendTrackEvent({ "tid": "game", "event": 'close', "data": { "url": url } });
            });

            f.style.cssText = 'z-index:918;position:absolute;top:0;left:0;width:100vw;height:100vh;border:0';
            f.setAttribute('sandbox', 'allow-scripts allow-same-origin');


            f.contentWindow.AdSDK = {
                closeView: function () {
                    win.openViewing = false;
                    f.remove();
                    close.remove();
                },
                sendTrackEvent: function (params) {
                    if (!params.event) {
                        return;
                    }
                    if (!params.event.startsWith('game_')) {
                        params.event = 'game_' + params.event;
                    }
                    win.AdSDK.sendTrackEvent({ "tid": "game", "event": params.event, "data": params.data });
                },
                RewardedVideo: {
                    isReady: function () {
                        return win.AdSDK.RewardedVideo.isReady();
                    },
                    showAd: function (extID) {
                        win.AdSDK.RewardedVideo.showAd('game', extID);
                    }
                },
                InterstitialAd: {
                    isReady: function () {
                        return win.AdSDK.InterstitialAd.isReady();
                    },
                    showAd: function () {
                        win.AdSDK.InterstitialAd.showAd('game');
                    }
                },
            };
            f.src = url;

        }
    };

    const adEventsAfterShowEnds = {
        showFailed: 1,
        close: 1
    };

    const positionEvent = {
        getPosData: function (event, pos, data) {
            return { "tid": "sdk", "event": event, "pos": pos.id, "posType": pos.type, "crid": pos.crid, "mpid": pos.mpid, "cpid": pos.cpid, "data": data };
        },
        getParam: function (key, param) {
            let td = { "key": key };
            if (param) {
                td = Object.assign(param, td);
            }
            return td;
        },
        /**
         * 记录展现的次数
         * @param {string} key 
         * @param {object} param 
         */
        show: function (key, param) {
            key = key ? key : '_default';
            let pos = AdSDK.lazy[key];
            if (pos) {
                let data = this.getPosData('pos_impr', pos, this.getParam(key, param));
                AdSDK.sendTrackEvent(data);
            }
        },
        /**
         * 记录点击的次数
         * @param {string} key 
         * @param {object} param 
         */
        click: function (key, param) {
            key = key ? key : '_default';
            let pos = AdSDK.lazy[key];
            if (pos) {
                let data = this.getPosData('pos_click', pos, this.getParam(key, param));
                AdSDK.sendTrackEvent(data);
            }
        },
        /**
         * 记录关闭的次数
         * @param {string} key 
         * @param {object} param 
         */
        close: function (key, param) {
            key = key ? key : '_default';
            let pos = AdSDK.lazy[key];
            if (pos) {
                let data = this.getPosData('pos_close', pos, this.getParam(key, param));
                AdSDK.sendTrackEvent(data);
            }
        }
    }

    const adEventsAfterShow = Object.assign({
        show: 1,
        click: 1,
        started: 1,
        ended: 1,
        rewarded: 1
    }, adEventsAfterShowEnds);

    win.addEventListener('message', e => {
        const { data } = e;
        const { type } = data;
        delete data.type;
        if (AdSDK.debug) {
            console.log(type, data);
        }
        const regArr = /^(ad|wv)\.(.*)$/i.exec(type);
        if (!regArr) {
            return
        }
        const eventGroup = regArr[1];
        const eventType = regArr[2];

        const ev = doc.createEvent('Event');
        ev.initEvent(eventType, true, false);
        Object.assign(ev, data);

        if (eventGroup === 'wv') {
            if (eventType === 'init') {
                Object.assign(initData, data)
            } else if (eventType === 'show') {
                if (data.pos) {
                    initData.pos = data.pos
                }
            } else if (eventType === 'posReady') {
                const pos = data.pos;
                if (data.states === 'new') {
                    for (let i = 0; i < pos.length; i++) {
                        if (pos[i] && pos[i].key) {
                            initData.lazy[pos[i].key] = pos[i];
                        }
                    }
                }
                let list = [];
                for (let i = 0; i < pos.length; i++) {
                    if (pos[i] && pos[i].key) {
                        list.push(pos[i]);
                    }
                }
                ev.pos=list;
                if (!AdSDK.bfs) {
                    return;
                }
            }
            AdSDK._et.dispatchEvent(ev)
        } else /* eventGroup === 'ad' */ {
            const AD = data.adType === 'video' ? RewardedVideo : (data.adType === 'offerwall' ? OfferWall : InterstitialAd);
            if (eventType === 'availabilityChanged') {
                AD._ready = data.ready
            } else if (adEventsAfterShow[eventType]) {
                if (!AD._myAd) {
                    return // 忽略不属于本页面的 AD show 之后的事件
                }
            }
            AD._et.dispatchEvent(ev);
            if (adEventsAfterShowEnds[eventType]) {
                AD._myAd = false
            }
        }
    });

    win.AdSDK = AdSDK;
}(window, document));
