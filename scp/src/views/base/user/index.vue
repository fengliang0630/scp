<template>
  <div>
    <scp-list ref="customList" :listConfig="listConfig" @queryData="queryData" @addUser="addUser" :exportName="'用户数据'">
        <template v-slot:op="data">
          <i title="修改" class="pointer el-icon-edit" @click="updateHandler(data.row)"></i>
          <i title="查看" class="pointer el-icon-view" @click="viewHandler(data.row)"></i>
          <i title="删除" class="pointer el-icon-delete" @click="deleteItem(data.row)"></i>
        </template>
    </scp-list>

    <scp-dialog v-if="!!dialogConfig.visible" :dialogConfig="dialogConfig" @sureHandler="sureHandler"></scp-dialog>
  </div>
</template>

<script>
import api from '@/api';

export default {
  name: 'User',
  data() {
    return {
      dialogType: null,
      listConfig: {
        formItems: [
          { key: 'name', label: '姓名:'},
          { key: 'gender', label: '性别:', inputType: 'select', items: 'GENDER' }
        ],
        buttons: [
          { label: '新增用户', handlerMethod: 'addUser' }
        ],
        tableHeaders: [
          { label: '姓名', prop: 'name', width: 80 },
          { label: '性别', prop: 'gender', width: 80, codeValueKey: 'GENDER' },
          { label: '身份证', prop: 'cardNo', width: 200 },
          { label: '出生年月', prop: 'birthday', width: 100 },
          { label: '民族', prop: 'nation', width: 80, codeValueKey: 'NATION' },
          { label: '手机', prop: 'telephone', width: 150 },
          { label: '籍贯', prop: 'nationPlace', width: 200 },
          { label: '所属辖区', prop: 'place', width: 100 },
          { label: '操作', prop: 'op', isSlot: true, noExport: true },
        ],
        total: 0,
      },
      dialogConfig: {
        visible: false,
        type: 'form',
        width: '60%',
        title: '标题',
        formItems: [
          { 
            key: 'name', 
            label: '姓名:', 
            rules: [{ required: true, message: '姓名为必输项', trigger: 'blur' }]
          },
          { 
            key: 'gender', 
            label: '性别:', 
            inputType: 'select', 
            items: 'GENDER'
          },
          { 
            key: 'cardNo', 
            label: '身份证:', 
            rules: [{ required: true, message: '身份证为必输项', trigger: 'blur' }]
          },
          { 
            key: 'birthday', 
            label: '出生年月:',
            inputType: 'date'
          },
          { 
            key: 'nation', 
            label: '民族:', 
            inputType: 'select', 
            items: 'NATION'
          },
          { 
            key: 'telephone', 
            label: '手机:'
          },
          { 
            key: 'nationPlace',
            label: '籍贯:'
          },
          { 
            key: 'place',
            label: '所属辖区:'
          }          
        ]
      },
    };
  },
  mounted() {
    /** 首次加载 查询数据*/
    this.resetLoad();
  },
  methods: {
    resetLoad() {
      const queryParams = this.$refs.customList.getQueryParams();
      this.queryData(queryParams);
    },
    queryData(_queryParams) {
      this.$http.post(api.user.queryUserList.url, {}).then( data => {
          this.$refs.customList.setTableData(data.userList, data.total);
      });
    },
    /** 新增用户 */
    addUser() {
      this.dialogConfig.formItems.forEach(item => {
        item.value = '';
      });
      this.dialogType = {
        type: 'add'
      };
      this.dialogConfig.title = '新增用户';
      this.dialogConfig.visible = true;
    },
    /** 修改 */
    updateHandler(row) {
      this.$http.post(api.user.queryUserInfoById.url, {id: row.id}).then( data => {
        this.dialogConfig.formItems.forEach(item => {
          item.value = data.userInfo[item.key];
        });
        this.dialogType = {
          type: 'update',
          id: row.id
        };
        this.dialogConfig.title = '修改用户';
        this.dialogConfig.visible = true;
      });
    },
    viewHandler(row) {
      this.$http.post(api.user.queryUserInfoById.url, {id: row.id}).then( data => {
        this.dialogConfig.formItems.forEach(item => {
          item.value = data.userInfo[item.key];
          item.disabledModify = true;
        });
        this.dialogConfig.title = '查看用户';
        this.dialogConfig.visible = true;
      });
    },
    /** 删除 */
    deleteItem(row) {
      this.$msg.confirm({
        msg: '确认删除该信息？',
        confirmCallback: () => {
          this.$http.post(api.user.deleteUserById.url, {}).then( res => {
            this.$msg.success('删除成功');
            this.resetLoad();
          });
        }
      });
    },
    sureHandler(_data) {
      if(!!this.dialogType && this.dialogType.type === 'update') {
        _data.id = this.dialogType.id;
        this.saveOrUpdate(_data, '修改用户成功');
      }

      if(!!this.dialogType && this.dialogType.type === 'add') {
        _data.id = this.dialogType.id;
        this.saveOrUpdate(_data, '新增用户成功');
      }
    },
    saveOrUpdate(_data, _msg) {
      this.$http.post(api.user.deleteUserById.url, _data).then( res => {
        this.dialogType = null;
        this.$msg.success(_msg);
        this.resetLoad();
      });
    }
  },
}
</script>

<style scoped lang="scss">
.user {
  height: 100%;
}
</style>
