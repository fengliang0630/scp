<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import msgService from '@/service/msg.service';
export default {
  name: 'App',
  created() {
    window.$bus = this.$bus;
    
  },
  mounted() {
    this.$bus.on('hoperun.message', function(_msg, _type) {
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
