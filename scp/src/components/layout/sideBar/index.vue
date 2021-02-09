<template>
  <el-scrollbar class="side-bar-container" :class="{ 'is-collapse': collapse }">
    <logo></logo>
    <el-menu :background-color="variables['menu-background']" mode="vertical" :unique-opened="uniqueOpened"
      :text-color="variables['menu-color']" :active-text-color="variables['menu-color-active']" :default-active="defaultActive"
      :collapse="collapse" :collapse-transition="true">
        <template v-for="(item,i) in menuData">
          <el-menu-item v-if="!item.children" :key="i" :index="item.path" :title="item.name" @click="menuClick(item)">
            <scp-icon :icon="['fas', item.icon]" class="vab-fas-icon" />
            <span>{{item.name}}</span>
          </el-menu-item>
          <el-submenu v-else :key="i" :index="`${i}`" :title="item.name">
            <template slot="title">
              <scp-icon :icon="['fas', item.icon]" class="vab-fas-icon" />
              <span>{{item.name}}</span>
            </template>
            <el-menu-item v-for="(subItem,j) in item.children" :key="`${i}-${j}`" :index="subItem.path" :title="subItem.name" @click="menuClick(subItem)">
              <scp-icon :icon="['fas', subItem.icon]" class="vab-fas-icon" />
              <span>{{subItem.name}}</span>
            </el-menu-item>
          </el-submenu>
        </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import Logo from './logo';
import variables from "@/../styles/variables.scss";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "sideBar",
  data(){
    return {
      uniqueOpened: true
    }
  },
  created() {
    this.queryMenuData();
  },
  computed: {
    ...mapGetters({
        collapse: "settings/collapse",
        menuData: 'menu/getMenuTree'
    }),
    variables() {
      return variables;
    },
    defaultActive() {
      const activeTab = this.getTabs().activeTab;
      return activeTab.path;
    }
  },
  methods: {
    ...mapActions({
      addTab: 'tabs/addTab',
      queryMenuData: 'menu/queryMenuData'
    }),
    ...mapGetters({
        getTabs: "tabs/getTabs"
    }),
    menuClick(_item) {
      this.addTab(_item);
      this.$router.push({name: _item.path});
    }
  },
  components: {
    'logo': Logo
  }
};
</script>

<style lang="scss" scoped>
@import "@/../styles/variables.scss";

@mixin active {
    &:hover {
      color: $base-color-white;
      background-color: $base-menu-background-active !important;
    }

    &.is-active {
      color: $base-color-white;
      background-color: $base-menu-background-active !important;
    }
  }

.side-bar-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: $base-z-index;
  width: $base-left-menu-width;
  height: 100vh;
  overflow: hidden;
  background: $base-menu-background;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  transition: width $base-transition-time;

  &.is-collapse {
    width: $base-left-menu-width-min;
    border-right: 0;

    /deep/ {
      .el-menu {
        transition: width $base-transition-time;
      }

      .el-menu--collapse {
        border-right: 0;

        .el-submenu__icon-arrow {
          right: 10px;
          margin-top: -3px;
        }
      }
    }
  }

  /deep/ {
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    .el-menu {
      border: 0;

      .vab-fas-icon {
        padding-right: 3px;
        font-size: $base-font-size-default;
      }

      .vab-remix-icon {
        padding-right: 3px;
        font-size: $base-font-size-default + 2;
      }
    }

    .el-menu-item,
    .el-submenu__title {
      height: $base-menu-item-height;
      overflow: hidden;
      line-height: $base-menu-item-height;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: middle;
    }

    .el-menu-item {
      @include active;
    }
  }
}
</style>
