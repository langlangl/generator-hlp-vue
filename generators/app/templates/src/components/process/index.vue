<template>
  <div class="wrapper" v-show="isShow">
    <div class="progress" id="vaderSize">
      <i>Big surprise is coming...</i
      ><span class="barControl" style="width:10%;"
        ><div class="barContro_space" style="border-radius:1.5rem">
          <span
            class="vader"
            :style="'height: 0.22rem; width: '+width+'%;'"
            id="barvaderSize"
          ></span></div
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
  },
  watch: {
    '$store.state.loading': function (value) {
        if(value) {
            this.start()
        }
    }
  },
  data() {
    return {
        width:0,
        speed:10,
        timer:null,
        isShow:false
    };
  },

  mounted() {
   
  },
  methods:{
      start(){
         this.isShow = true
         this.timer =  setInterval(()=>{
              if(this.width > 90){
                clearInterval(this.timer)
                 this.isShow = false
                 this.width = 0
                 this.$store.commit('setLoading', false)
                return;
              }
              this.width+=this.speed;
          },100)
      }
  }
};
</script>
<style scoped>
.wrapper{
    position: fixed;
    z-index: 10000;
    width: 100%;
    height: 100%;
    background: white;
    top: 0;
    left: 0;
}
.progress{
    -webkit-box-direction: normal;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
    font-weight: normal;
    font-family: Arial;
    position: absolute;
    width: 90%;
    height: 0.22rem;
    background: linear-gradient(90deg,rgba(255,41,36,1)0%,rgba(255,150,0,1)100%);
    box-shadow: 0rem 0.08rem 0.15rem 0rem rgba(58,37,0,0.3);
    border-radius: 1.5rem;
    text-align: center;
    margin: auto 5%;
    top: 50%;
    transform: translateY(-50%);
    /* z-index: 1111; */
}
.progress i{
    -webkit-box-direction: normal;
    text-align: center;
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    vertical-align: baseline;
    font-weight: normal;
    font-family: Arial;
    -webkit-tap-highlight-color: rgba(255,0,0,0);
    position: absolute;
    left: 0.1rem;
    font-size: .17rem;
    color: white;
    font-style: inherit;
    line-height: 0.22rem;
}
.vader{
     -webkit-box-direction: normal;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    text-align: center;
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
    font-weight: normal;
    font-family: Arial;
    border-radius: 1.5rem;
    display: block;
    background: linear-gradient(90deg,rgba(123,182,55,1)0%,rgba(183,232,80,1)100%);
    height: 0.22rem;
    width: 98%;
}

</style>
