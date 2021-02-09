<template>
  <div class="nav-bar-container">
    <el-row :gutter="15">
      <el-col :xs="4" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="left-panel">
          <i :title="collapse ? '展开' : '收起'"
            :class="collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" class="fold-unfold" @click="handleCollapse"></i>
          <breadcrumb></breadcrumb>
        </div>
      </el-col>
      <el-col :xs="20" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="right-panel">
          <full-screen @refresh="refreshRoute"></full-screen>
          <scp-icon
            title="重载所有路由"
            :pulse="pulse"
            :icon="['fas', 'redo']"
            @click="refreshRoute"
          />
          <!-- <vab-theme-bar class="hidden-xs-only" />
          
          <vab-avatar /> -->
          <!--  <vab-icon
            title="退出系统"
            :icon="['fas', 'sign-out-alt']"
            @click="logout"
          />-->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import FullScreen from './fullScreen';
  import Breadcrumb from './breadcrumb';

  export default {
    name: 'VabNavBar',
    data() {
      return {
        pulse: false,
      }
    },
    computed: {
      ...mapGetters({
        collapse: 'settings/collapse'
      }),
    },
    methods: {
      ...mapActions({
        changeCollapse: 'settings/changeCollapse',
      }),
      handleCollapse() {
        this.changeCollapse()
      },
      async refreshRoute() {
        this.$bus.emit('hoperun.reload.router.view');
        this.pulse = true
        setTimeout(() => {
          this.pulse = false
        }, 1000)
      }
    },
    components: {
      'full-screen': FullScreen,
      'breadcrumb': Breadcrumb
    }
  }
</script>

<style lang="scss" scoped>
@import "@/../styles/variables.scss";
.nav-bar-container {
    position: relative;
    height: $base-nav-bar-height;
    padding-right: $base-padding;
    padding-left: $base-padding;
    overflow: hidden;
    user-select: none;
    background: $base-color-white;
    box-shadow: $base-box-shadow;

    .left-panel {
      display: flex;
      align-items: center;
      justify-items: center;
      height: $base-nav-bar-height;

      .fold-unfold {
        color: $base-color-gray;
        cursor: pointer;
      }

      ::v-deep {
        .breadcrumb-container {
          margin-left: 10px;
        }
      }
    }

    .right-panel {
      display: flex;
      align-content: center;
      align-items: center;
      justify-content: flex-end;
      height: $base-nav-bar-height;

      /deep/ {
        svg {
          width: 1em;
          height: 1em;
          margin-right: 15px;
          font-size: $base-font-size-small;
          color: $base-color-gray;
          cursor: pointer;
          fill: $base-color-gray;
        }

        button {
          svg {
            margin-right: 0;
            color: $base-color-white;
            cursor: pointer;
            fill: $base-color-white;
          }
        }

        .el-badge {
          margin-right: 15px;
        }
      }
    }
  }
</style>
