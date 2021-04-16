/*
 * @Author: Kuaiyin FE
 * @Date: 2020-08-14 12:56:00
 * @Description: ModalWrapper 全局实例化
 * @FilePath: /bt-game/src/components/ModalWrapper/index.js
 */

// 引入组件
import ModalWrapperComponent from './ModalWrapper.vue';

const ModalWrapper = {
    // install 是默认的方法。当外界在 use 这个组件的时候，就会调用本身的 install 方法，同时传一个 Vue 这个类的参数。
    install(Vue) {
        Vue.component('ModalWrapper', ModalWrapperComponent);
    },
};

export default ModalWrapper;
