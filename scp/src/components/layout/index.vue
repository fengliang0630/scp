<template>
  <div class="vue-admin-beautiful-wrapper">
    <div class="layout-container-vertical fixed">
      <side-bar></side-bar>
      <div class="main-div" :class="collapse ? 'is-collapse-main' : ''">
        <div class="fixed-header">
          <nav-bar></nav-bar>
          <tab-bar></tab-bar>
        </div>
        <hoperun-main></hoperun-main>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NavBar from './navBar';
import SideBar from './sideBar';
import TabsBar from './tabsBar';
import Main from './main';

export default {
  name: "Layout",
  computed: {
    ...mapGetters({
        collapse: 'settings/collapse'
      })
  },
  components: {
    'side-bar': SideBar,
    'nav-bar': NavBar,
    'hoperun-main': Main,
    'tab-bar': TabsBar
  }
};
</script>

<style lang="scss" scoped>
@import "@/../styles/variables.scss";
@mixin fix-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: $base-z-index - 2;
  width: 100%;
  overflow: hidden;
}

.vue-admin-beautiful-wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  .layout-container-vertical {
    height: calc(100% - #{$base-nav-bar-height} - #{$base-tabs-bar-height});
    position: relative;

    .mask {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: $base-z-index - 1;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      background: #000;
      opacity: 0.5;
    }

    &.fixed {
      padding-top: calc(#{$base-nav-bar-height} + #{$base-tabs-bar-height});
    }

    &.fixed.no-tabs-bar {
      padding-top: $base-nav-bar-height;
    }

    .main-div {
      position: relative;
      margin-left: $base-left-menu-width;
      background: #f6f8f9;
      transition: $base-transition;

      /deep/ {
        .fixed-header {
          @include fix-header;

          left: $base-left-menu-width;
          width: $base-right-content-width;
          box-shadow: $base-box-shadow;
          transition: $base-transition;
        }

        .nav-bar-container {
          position: relative;
          box-sizing: border-box;
        }

        .tabs-bar-container {
          box-sizing: border-box;
        }

        .main-container {
          width: calc(100% - #{$base-padding} - #{$base-padding});
          margin: $base-padding auto;
          background: $base-color-white;
          border-radius: $base-border-radius;
        }
      }

      &.is-collapse-main {
        margin-left: $base-left-menu-width-min;

        /deep/ {
          .fixed-header {
            left: $base-left-menu-width-min;
            width: calc(100% - 65px);
          }
        }
      }
    }
  }
}
</style>
