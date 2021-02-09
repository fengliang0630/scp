import VabIcon from 'vab-icon'
import List from '@/components/list';
import Form from '@/components/form';
import Dialog from '@/components/dialog';
import config from '@/config';

export default {
  install: function (Vue) {
    Vue.component(`${config.systemFlag}-icon`, VabIcon);
    Vue.component(`${config.systemFlag}-list`, List);
    Vue.component(`${config.systemFlag}-form`, Form);
    Vue.component(`${config.systemFlag}-dialog`, Dialog);
  }
};