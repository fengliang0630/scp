import config from '@/config'
import axios from '@/api/axios'

export default {
  install: function (Vue) {
    /* 全局标题 */
    Vue.prototype.$baseTitle = (() => {
      return config.title
    })()

    /* 全局化 请求 */
    Vue.prototype.$http = (() => {
      window.$http = axios;
      return axios
    })()

    /* 全局化 消息提示 */
    Vue.prototype.$msg = (() => {
      const msgTool = {
        success(_msg) {
          window.$bus.emit('hoperun.message', _msg, 'success');
        },
        warning(_msg) {
            window.$bus.emit('hoperun.message', _msg, 'warning');
        },
        error(_msg) {
            window.$bus.emit('hoperun.message', _msg, 'error');
        },
        alert(_option) {
            window.$bus.emit('hoperun.message', _option, 'alert');
        },
        confirm(_option) {
            window.$bus.emit('hoperun.message', _option, 'confirm');
        }
      };
      window.$msg = msgTool;
      return msgTool;
    })()

    
  }
};