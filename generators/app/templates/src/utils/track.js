/*
 * @Author: Kuaiyin FE
 * @Date: 2020-08-20 10:59:36
 * @Description: 埋点方法定义
 * @FilePath: /bt-game/src/util/track.js
 */
const { sendTrackEvent } = window.AdSDK;
let uid = sessionStorage.UID;
let abt = sessionStorage.strategy;

if (!uid) {
    uid = '';
}
if (!abt) {
    abt = '';
}
const VER = {
    ver: process.env.VUE_APP_CLIENT_VERSION,
};
const pageViewEvent = ({ title = '', url, host, referrer, remarks = '', elementName = '' }) => {
    const event = {
        tid: '1001',
        event: 'page_view',
        data: {
            page_title: title,
            url,
            referrer_host: host,
            referrer,
            uid,
            abt,
            remarks,
            element_name: elementName,
            ...VER,
        },
    };
    console.log(event);
    sendTrackEvent(event);
};

const pageStayEvent = ({ title, url, time }) => {
    const event = {
        tid: '1002',
        event: 'page_stay',
        data: {
            page_title: title,
            url,
            stay_time: time,
            uid,
            abt,
            ...VER,
        },
    };
    console.log(event);
    sendTrackEvent(event);
};

const adFunnelEvent = ({ type, pos, stage, msg = '' }) => {
    const event = {
        tid: '1003',
        event: 'ad_funnel',
        data: {
            ad_type: type,
            ad_position: '',
            app_position: pos,
            ad_stage: stage,
            is_success: 1,
            content: '',
            error: msg,
            uid,
            abt,
            ...VER,
        },
    };
    console.log(event);
    sendTrackEvent(event);
};

const trackEvent = ({ ev, remarks = '', elementName = '', pageTitle = '',content='' }) => {
    const {  referrer,href } = window.location;
    const event = {
        tid: '1004',
        event: ev,
        data: {
            url: href,
            referrer,
            remarks,
            uid,
            abt:sessionStorage.strategy == "A" ? 0 : 1,
            element_name: elementName,
            page_title: pageTitle,
            content,
            ...VER,
        },
    };
    console.log(event);
    sendTrackEvent(event);
};


const track = {
    pageViewEvent,
    pageStayEvent,
    adFunnelEvent,
    trackEvent,
};

export default track;
