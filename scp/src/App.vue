<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import msgService from '@/service/msg.service';
import { cacheData } from '@/utils/cache';
import config from '@/config';

export default {
  name: 'App',
  created() {
    window.$bus = this.$bus;  
    this.$store.commit('cache');
    
    cacheData(()=>{
      sessionStorage.setItem("cacheData", JSON.stringify(this.$store.state));
    });
  },
  mounted() {
    this.$bus.on(`${config.systemFlag}.message`, function(_msg, _type) {
      msgService[_type].apply(this, [_msg]);
    });
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
