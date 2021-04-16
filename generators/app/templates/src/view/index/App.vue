<template>
  <div id="index">
    <!-- <videoPage/> -->
      <keep-alive>
            <router-view v-show="$store.state.active"></router-view>
      </keep-alive>
    <loading  v-show="!$store.state.active"/>
    <process></process>
  </div>
</template>

<script>
import loading from '../../components/loading'
import process from '../../components/process'
export default {
  name: 'index',
  components: {
    // videoPage,
    process,
    loading
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  line-height: 100%;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}
/* .img{
  width:12.5rem;
  height:15.625rem
} */
html {
  user-select: none;
  /* stylelint-disable-next-line value-no-vendor-prefix */
  -webkit-text-size-adjust: none;
  /* stylelint-disable-next-line value-no-vendor-prefix */
  -webkit-tap-highlight-color: transparent;
  -webkit-font-smoothing: antialiased;
  height: 100%;
}

body {
  background: transparent;
  padding: 0;
  margin: 0;
  font-size: 14px;
  word-wrap: break-word;
  text-rendering: optimizeLegibility;
  backface-visibility: hidden;
  height: 100%;
  font-family: 'Roboto';
}
#app {
  position: relative;
}
</style>
