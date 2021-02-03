/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 校验密码是否小于6位
 * @param str
 * @returns {boolean}
 */
export function isPassword(str) {
    return str.length >= 6
  }