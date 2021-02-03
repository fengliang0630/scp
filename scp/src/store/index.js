import Vue from "vue";
import Vuex from "vuex";

const files = require.context('./modules', false, /\.js$/)
const modules = {}

files.keys().forEach((key) => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})
Object.keys(modules).forEach((key) => {
  modules[key]['namespaced'] = true
})

Vue.use(Vuex);
export default new Vuex.Store({
    modules,
    mutations: {
        // 刷新恢复vuex中的数据
        cache(_status) {
            const cacheData = JSON.parse(sessionStorage.getItem("cacheData"));
            if (!!cacheData) {
              Object.keys(cacheData).forEach(_key => {
                _status[_key] = cacheData[_key];
              });
              sessionStorage.removeItem('cacheData');
            }
        }
    }
});