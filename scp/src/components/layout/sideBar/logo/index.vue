<template>
  <div class="logo-container-vertical">
    <router-link to="/">
      <scp-icon :icon="['fas', 'home']" class="logo" />
      <span class="title" :title="title">
        {{ title }}
      </span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "logo",
  data() {
    return {
      title: this.$baseTitle
    };
  }
};
</script>

<style lang="scss" scoped>
@import "@/../styles/variables.scss";
@mixin container {
  position: relative;
  height: $base-top-bar-height;
  overflow: hidden;
  line-height: $base-top-bar-height;
  background: $base-menu-background;
}

@mixin logo {
  display: inline-block;
  width: 32px;
  height: 32px;
  margin-right: 5px;
  color: $base-title-color;
  vertical-align: middle;
}

@mixin title {
  display: inline-block;
  overflow: hidden;
  font-size: 20px;
  line-height: 55px;
  color: $base-title-color;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.logo-container-vertical {
    @include container;

    height: $base-logo-height;
    line-height: $base-logo-height;
    text-align: center;

    .logo {
      @include logo;
    }

    .title {
      @include title;

      max-width: calc(#{$base-left-menu-width} - 60px);
    }
  }
</style>
