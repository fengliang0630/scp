<template>
  <el-breadcrumb class="breadcrumb-container" separator=">">
    <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path">
      {{ item.breadcrumbName || item.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { mapGetters } from "vuex";

  export default {
    name: 'Breadcrumb',
    data() {
      return {}
    },
    computed: {
      breadcrumbList() {
        let menuArray = this.menuData();
        return this.$route.matched.filter(
          (item, index) => {
            const menu = menuArray.find(item => this.$route.matched[index].name === item.path) || {};
            item.breadcrumbName = menu.name || '';
            menuArray = menu.children || [];
            return item.name && item.meta.title;
          }
        )
      }
    },
    methods: {
      ...mapGetters({
          menuData: 'menu/getMenuTree'
      })
    }
  }
</script>

<style lang="scss" scoped>
@import "@/../styles/variables.scss";
.breadcrumb-container {
  padding-left: 10px;
  height: $base-nav-bar-height;
  font-size: $base-font-size-default;
  line-height: $base-nav-bar-height;

  /deep/ {
    .el-breadcrumb__item {
      .el-breadcrumb__inner {
        a {
          display: flex;
          float: left;
          font-weight: normal;
          color: #515a6e;

          i {
            margin-right: 3px;
          }
        }
      }

      &:last-child {
        .el-breadcrumb__inner {
          a {
            color: #999;
          }
        }
      }
    }
  }
}
</style>
