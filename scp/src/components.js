import VabIcon from 'vab-icon'
import List from '@/components/list';
import Form from '@/components/form';

// 自定义组件标识
const componentFlag = 'hoperun';

export default {
  install: function (Vue) {
    Vue.component(`${componentFlag}-icon`, VabIcon);
    Vue.component(`${componentFlag}-list`, List);
    Vue.component(`${componentFlag}-form`, Form);
    
  }
};