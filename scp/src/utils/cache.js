/**
 * 监听浏览器刷新事件  缓存vuex中的数据
 */
export function cacheData(_callBack) {
  window.addEventListener("beforeunload", _callBack);
}