/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/*
 * @Author: Kuaiyin FE
 * @Date: 2020-08-14 12:53:41
 * @Description: Modal 实例化方法
 * @FilePath: /bt-game/src/components/ModalWrapper/ModalInstance.js
 */

import Vue from 'vue';

const instanceList = [];
let countId = 0;

class Modal {
    constructor(component) {
        this._control = Vue.extend(component);
        return this._initModal;
    }

    _initModal = (options) => {
        options = options || {};
        // 分发自己的ID
        const id = `modal_${++countId}`;
        // 实例化组件，合并data参数
        let instance = null;
        instance = new this._control({
            data: options,
        });
        // 实例配置ID
        instance.id = id;
        // 保存自有关闭回调方法
        const selfOnColse = options.onClose;
        // 重写关闭回调方法，主要是从实例中销毁自己的id
        options.onClose = () => {
            this._close(id, selfOnColse);
        };
        // 文档之外渲染，随后挂载
        instance.$mount();
        const { $el } = instance;

        document.body.appendChild($el);
        instance.open();
        instanceList.push(instance);
        return instance;
    };

    _close = (id, callback) => {
        for (let index = 0; index < instanceList.length; index++) {
            const _instance = instanceList[index];
            if (_instance.id === id) {
                if (typeof callback === 'function') {
                    callback();
                }
                instanceList.splice(index, 1);
                break;
            }
        }
    };

    // 判断是为Vue组件
    _isComponent = (node) => {
        return (
            node !== null && typeof node === 'object' && Object.prototype.hasOwnProperty.call(node, 'componentOptions')
        );
    };
}
export default Modal;
