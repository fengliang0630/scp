/** 默认alert窗口配置 */
const DEFAULT_ALERT_CONFIG = {
    title: '标题',
    confirmButtonText: '确定',
    callBack: () => {}
  }
  
  /** 默认confirm 窗口配置 */
  const DEFAULT_CONFIRM_CONFIG = {
    title: '提示',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmCallback: () => {},
    cancelCallback: () => {}
  };
  
  export default {
    success(_msg) {
      this.$message({
        message: _msg,
        type: 'success'
      });
    },
    warning(_msg) {
      this.$message({
        message: _msg,
        type: 'warning'
      });
    },
    error(_msg) {
      this.$message({
        message: _msg,
        type: 'error'
      });
    },
    /**
     * @param {
     *    msg                // 必填  提示信息内容
     *    title              // 非必填【标题】  弹出窗口标题
     *    confirmButtonText  // 非必填【确定】 按钮内容
     *    callBack           // 非必填【空函数】 点击按钮回调事件
     * } options          
     */
    alert(_options) {
      const option = Object.assign(DEFAULT_ALERT_CONFIG,_options);
      this.$alert(option.msg, option.title, {
        confirmButtonText: option.confirmButtonText,
        callback: option.callBack
      });
    },
    /**
     * @param {
     *    msg                // 必填             提示信息内容
     *    title              // 非必填【提示】    弹出窗口标题
     *    confirmButtonText  // 非必填【确定】    确定按钮内容
     *    cancelButtonText   // 非必填【取消】    取消按钮内容
     *    confirmCallback    // 非必填【空函数】  确定按钮回调事件
     *    cancelCallback     // 非必填【空函数】  取消按钮回调事件
     *    type               // 比必填【warning】 类型  可选填： warning, info, error, success
     * } _options 
     */
    confirm(_options) {
      const option = Object.assign(DEFAULT_CONFIRM_CONFIG,_options);
      this.$confirm(option.msg, option.title, {
        confirmButtonText: option.confirmButtonText,
        cancelButtonText: option.cancelButtonText,
        type: option.type
      }).then(option.confirmCallback).catch(option.cancelCallback);
    }
  }