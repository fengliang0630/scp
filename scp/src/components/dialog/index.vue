<template>
  <div id="dialog" class="custom-dialog">
    <el-dialog :title="dialogConfig.title || '提示'" :width="dialogConfig.width || '50%'" :visible.sync="dialogConfig.visible" :destroy-on-close="true" @close="close">
        <div class="content">
          <slot v-if="!dialogConfig.type || dialogConfig.type === 'slot'"></slot>
          <div v-if="dialogConfig.type === 'form' && !!formItems && !!formItems.length">
            <hoperun-form ref="dialogForm" :formItems="formItems" :noButtonFlag="true" @submitForm="submitForm"></hoperun-form>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancle">取 消</el-button>
            <el-button type="primary" @click="sure">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import codeValue from '@/config/codeValue';

export default {
  name: "cpsDialog",
  data() {
    return {}
  },
  beforeDestroy() {
    this.$refs.dialogForm.resetForm();
  },
  props: {
    dialogConfig: {
      type: Object,
      default: this.defaultDialogConfig
    }
  },
  computed: {
    formItems() {
      const _formItems = this.dialogConfig.formItems;
      _formItems.forEach(item => {
        const obj = {};
        obj.colLength = item.colLength || 8;

        if (item.inputType === 'select' && typeof item.items === 'string') {
          obj.items = [];
          for (let [label, value] of Object.entries(codeValue[item.items])) {
            obj.items.push({ label, value });
          }
        }
        Object.assign(item, obj);
      });
      return _formItems;
    }
  },
  methods: {
    /** 弹窗关闭  重置表单 */
    close() {
      this.$refs.dialogForm.resetForm();
    },
    /** 表单提交回调函数 */
    submitForm(_formData) {
      this.$emit('sureHandler', _formData);
      this.dialogConfig.visible = false;
    },
    /** 取消按钮回调 */
    cancle() {
      this.dialogConfig.visible = false;
    },
    /** 确定按钮回调 */
    sure() {
      this.$refs.dialogForm.submitForm();
    }
  }

};
</script>
