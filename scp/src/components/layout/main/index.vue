<template>
  <div v-if="routerView" class="main-container">
    <transition mode="out-in" name="fade-transform">
      <keep-alive :include="cachedRoutes" :max="keepAliveMaxNum">
        <router-view :key="key" class="app-main-height" />
      </keep-alive>
    </transition>
    <footer class="footer-copyright">
      Copyright
      <hoperun-icon :icon="['fas', 'copyright']"></hoperun-icon>
      {{copyright}} {{ fullYear }}
    </footer>
  </div>
</template>

<script>
  import config from '@/config'

  export default {
    name: 'Main',
    data() {
      return {
        show: false,
        fullYear: new Date().getFullYear(),
        copyright: config.copyright,
        keepAliveMaxNum: 99,
        routerView: true
      }
    },
    computed: {
      cachedRoutes() {
        const cachedRoutesArr = []
        return cachedRoutesArr
      },
      key() {
        return this.$route.path
      },
    },
    created() {
      this.$bus.on('hoperun.reload.router.view', () => {
        this.routerView = false
        this.$nextTick(() => {
          this.routerView = true
        })
      });
    }
  }
</script>

<style lang="scss" scoped>
@import "@/../styles/variables.scss";
  .main-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    .vab-keel {
      margin: $base-padding;
    }
    .app-main-height {
      min-height: $base-app-main-height;
    }

    .footer-copyright {
      min-height: 55px;
      line-height: 55px;
      color: rgba(0, 0, 0, 0.45);
      text-align: center;
      border-top: 1px dashed $base-border-color;
    }
  }
</style>
