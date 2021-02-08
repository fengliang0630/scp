/**
 * list 默认配置
 */
export default {
    // 系统默认查询N条数据
    defaultPageSize: 10,

    // 公共分页参数配置
    pagination: {
        size: this.defaultPageSize,
        sizes: [10, 20, 50, 100]
    }
}