<template>
  <hoperun-list ref="hoperunList" :listConfig="listConfig" @pageChange="pageChange"
    @addUser="addUser" :listData="listData">
      <template v-slot:gender="data">
        <span>{{data.row.gender | codeValueFilter('GENDER', data.row.gender)}}</span>
      </template>
      <template v-slot:op="data">
        <i title="修改" class="pointer el-icon-edit" @click="updateHandler(data.row)"></i>
        <i title="查看" class="pointer el-icon-view" @click="viewHandler(data.row)"></i>
        <i title="删除" class="pointer el-icon-delete" @click="deleteItem(data.row)"></i>
      </template>
  </hoperun-list>
</template>

<script>
import api from '@/api';

  export default {
    name: 'User',
    data() {
      return {
        listData: [],
        listConfig: {
          buttons: [
            { label: "新增用户", handlerMethod: "addUser" }
          ],
          tableHeaders: [
            { label: "姓名", prop: "name", width: 100 },
            { label: "性别", prop: "gender", width: 100, isSlot: true },
            { label: "身份证", prop: "cardNo", width: 200 },
            { label: "出生年月", prop: "birthday", width: 100 },
            { label: "民族", prop: "nation", width: 80 },
            { label: "手机", prop: "telephone", width: 150 },
            { label: "籍贯", prop: "nationPlace", width: 200 },
            { label: "所属辖区", prop: "place", width: 100 },
            { label: "操作", prop: "op", isSlot: true },
          ],
          total: 0,
      }
    };
  },
  mounted() {
    /** 首次加载 查询数据*/
    const defaultPageSize = this.$refs.hoperunList.getDefaultPageSize();
    this.queryData({size: defaultPageSize, pageNum: 1});
  },
  methods: {
    queryData(_currentPage) {
      this.$http.post(api.user.queryUserList.url, {}).then( data => {
          this.$refs.hoperunList.setTableData(data.userList, data.total);
      });
    },
    pageChange(_paginationObj) {
      this.queryData(_paginationObj);
    },
    /** 新增用户 */
    addUser() {

    },
    /** 修改 */
    updateHandler(row) {
      debugger;
    },
    /** 删除 */
    deleteItem(row) {
      
    }
  },
  }
</script>

<style scoped lang="scss">
.user {
  height: 100%;
}
</style>
