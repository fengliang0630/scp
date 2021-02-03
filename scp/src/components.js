import VabIcon from 'vab-icon'

// 自定义组件标识
const componentFlag = 'hoperun';

export default {
  install: function (Vue) {
    Vue.component(`${componentFlag}-icon`, VabIcon);
  }
};