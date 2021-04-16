<!--
 * @Author: Kuaiyin FE
 * @Date: 2020-08-14 11:28:11
 * @Description: ModalWrapper
 * @FilePath: /bt-game/src/components/ModalWrapper/ModalWrapper.vue
-->

<template>
  <transition name="modal-shade-fade" @after-leave="onAfterLeave">
    <!-- @touchmove.prevent -->
    <div class="shade" v-show="hasOpenModal">
      <transition name="modal-fade">
        <div v-show="hasOpenModal">
          <div class="container">
            <div class="close" @click="handleCloseModal" v-if="closeIcon">
              <img src="../../assets/images/modal-close.png" alt="" />
            </div>
            <slot></slot>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'modal-wrapper',
  props: {
    closeIcon: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      hasOpenModal: false,
      childThis: null,
      scrollTop: 0,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * @description: 打开弹窗
     * @param {type}
     * @return:void
     */
    show(childThis) {
      this.hasOpenModal = true
      if (childThis) {
        this.childThis = childThis
      }
      this.afterOpen()
    },
    /**
     * @description: 关闭弹窗
     * @param {closeTem} 需要关闭的实例对象
     * @return:void
     */
    close() {
      this.beforeClose()
      this.hasOpenModal = false
      // 回调自定义关闭事件
      if (this.$parent.onClose && typeof this.$parent.onClose === 'function') {
        this.$parent.onClose()
      }
    },
    handleCloseModal() {
      this.$emit('listenClose')
      this.close()
    },
    /**
     * @description: 动画结束，销毁组件
     * @param {}
     * @return:void
     */
    onAfterLeave() {
      this.destroyElement()
    },
    /**
     * @description: 销毁组件
     * @param {type}
     * @return:viod
     */
    destroyElement() {
      // 手动销毁挂载dom
      this.childThis.$destroy(true)
      this.childThis.$el.parentNode.removeChild(this.childThis.$el)
    },
    /**
     * @description: 保持弹窗内的滚动可以进行
     * @param {}
     * @return:viod
     */
    afterOpen() {
      this.scrollTop = this.pageScrollTop()
      document.body.classList.add('modalOpen')
      document.body.style.top = `-${this.scrollTop}px`
    },
    /**
     * @description: 移除固定背景
     * @param {}
     * @return: void
     */
    // 弹层关闭之前 要做的事
    beforeClose() {
      document.body.classList.remove('modalOpen')
      this.setScrollTop()
    },
    /**
     * @description: 兼容scrollTop方法
     * @param {}
     * @return: void
     */
    pageScrollTop() {
      if (document.scrollingElement) {
        return document.scrollingElement.scrollTop
      }
      return Math.max(
        window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop
      )
    },

    /**
     * @description: 兼容赋值
     * @param {}
     * @return: void
     */
    setScrollTop() {
      if (
        document.scrollingElement &&
        document.scrollingElement.scrollTop !== undefined
      ) {
        document.scrollingElement.scrollTop = this.scrollTop
        return
      }
      if (document.body && document.body.scrollTop !== undefined) {
        document.body.scrollTop = this.scrollTop
        return
      }
      if (
        document.documentElement &&
        document.documentElement.scrollTop !== undefined
      ) {
        document.documentElement.scrollTop = this.scrollTop
      }
    },
  },
}
</script>

<style lang="less" scoped>
.shade {
  background: rgba(0, 0, 0, 0.75);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  .container {
    position: relative;
    .close {
      position: absolute;
      right: 0rem;
      top: -0.36rem;
      z-index: 999;
      img {
        width: 0.24rem;
        height: 0.24rem;
      }
    }
  }
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.4s ease;
}
.modal-fade-enter,
.modal-fade-leave-to {
  transform: scale(0.2);
}
.modal-shade-fade-enter-active,
.modal-shade-fade-leave-active {
  transition: all 0.4s ease;
}
.modal-shade-fade-enter,
.modal-shade-fade-leave-to {
  opacity: 0;
}
</style>
