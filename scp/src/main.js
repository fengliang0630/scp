import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import VueBus from 'vue-bus';
import config from "@/config";
import router from "@/router";
import store from "@/store";
import filters from '@/filters';
import components from './components';
import globalSetting from './global_setting';

import 'element-ui/lib/theme-chalk/index.css';

import '../styles/themes/default.scss'

if (config.isMock) {
  require('../mock/index.js');
}

Vue.use(globalSetting);
Vue.use(components);
Vue.use(ElementUI);
Vue.use(VueBus);
Vue.use(filters);

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
