<template>
  <div id="tabs-bar-container" class="tabs-bar-container">
    <el-tabs
      :value="tabActive.path"
      type="card" ref="tabs"
      class="tabs-content"
      @tab-click="handleTabClick"
      @tab-remove="handleTabRemove"
    >
      <el-tab-pane
        v-for="item in tabs"
        :key="item.path"
        :label="item.name"
        :name="item.path"
        :closable="!!item.isClosed"
      ></el-tab-pane>
    </el-tabs>

    <el-dropdown @command="handleCommand">
      <span style="cursor: pointer">
        更多操作
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown" class="tabs-more">
        <el-dropdown-item command="closeOtherstabs">
          <scp-icon :icon="['fas', 'times-circle']" />
          关闭其他
        </el-dropdown-item>
        <el-dropdown-item command="closeLefttabs">
          <scp-icon :icon="['fas', 'arrow-alt-circle-left']"></scp-icon>
          关闭左侧
        </el-dropdown-item>
        <el-dropdown-item command="closeRighttabs">
          <scp-icon :icon="['fas', 'arrow-alt-circle-right']"></scp-icon>
          关闭右侧
        </el-dropdown-item>
        <el-dropdown-item command="closeAlltabs">
          <scp-icon :icon="['fas', 'ban']"></scp-icon>
          关闭全部
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from "vuex";

  export default {
    name: "VabTabsBar",
    computed: {
      tabs() {
        return this.getTabs().data;
      },
      tabActive() {
        return this.getTabs().activeTab;
      }
    },
    methods: {
      ...mapGetters({
        getTabs: "tabs/getTabs"
      }),
      ...mapActions({
        toggleActive: 'tabs/toggleActive',
        deleteRight: 'tabs/deleteRight',
        deleteLeft: 'tabs/deleteLeft',
        deleteOther: 'tabs/deleteOther',
        deleteAll: 'tabs/deleteAll',
        deleteOne: 'tabs/deleteOne'
      }),
      handleCommand(command) {
        switch (command) {
          case "closeOtherstabs":
            this.deleteOther();
            break;
          case "closeLefttabs":
            this.deleteLeft();
            break;
          case "closeRighttabs":
            this.deleteRight();
            break;
          case "closeAlltabs":
            this.deleteAll();
            this.refreshRoute(this.tabActive.path);
            break;
        }
      },
      // tab页签点击事件
      handleTabClick(_item) {
        this.toggleActive(_item.name);
        this.$router.push({name: _item.name});
      },
      // tab页签删除事件
      handleTabRemove(_path) {
        const isCurrent = this.tabActive.path === _path;
        this.deleteOne(_path);
        isCurrent && this.$router.push({name: this.tabActive.path});
      },
      // 刷新tab页签事件
      refreshRoute(_path) {
        this.$router.push({name: _path});
      }
    }
  };
</script>

<style lang="scss" scoped>
@import "@/../styles/variables.scss";
  .tabs-bar-container {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: space-between;
    height: $base-tabs-bar-height;
    padding-right: $base-padding;
    padding-left: $base-padding;
    user-select: none;
    background: $base-color-white;
    border-top: 1px solid #f6f6f6;

    /deep/ {
      .fold-unfold {
        margin-right: $base-padding;
      }
    }

    .tabs-content {
      width: calc(100% - 90px);
      height: $base-tag-item-height;

      /deep/ {
        .el-tabs__nav-next,
        .el-tabs__nav-prev {
          height: $base-tag-item-height;
          line-height: $base-tag-item-height;
        }

        .el-tabs__header {
          border-bottom: 0;

          .el-tabs__nav {
            border: 0;
          }

          .el-tabs__item {
            box-sizing: border-box;
            height: $base-tag-item-height;
            margin-right: 5px;
            line-height: $base-tag-item-height;
            border: 1px solid $base-border-color;
            border-radius: $base-border-radius;
            transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;

            &.is-active {
              border: 1px solid $base-color-blue;
            }
          }
        }
      }
    }

    .more {
      display: flex;
      align-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
</style>
