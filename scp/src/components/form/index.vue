<template>
  <div id="form" class="custom-form">
    <div v-if="!!formItems">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-width="labelLength" class="demo-ruleForm" :size="size" >
        <el-col v-for="item in formItems" :key="item.key" :span="item.colLength || 12">
          <el-form-item :label="item.label" :prop="item.key"  v-if="!item.hideFlag">

            <el-input v-model="ruleForm[item.key]" :disabled="item.disabledModify||disabledModify" v-if="!item.inputType||(item.inputType === 'input')" :placeholder="item.placeholder||''">
              <template v-if="item.slots && item.slots.prepend" slot="prepend">{{item.slots.prepend}}</template>
              <template v-if="item.slots && item.slots.append" slot="append">{{item.slots.append}}</template>
            </el-input>

            <el-select v-if="item.inputType === 'select'" v-model="ruleForm[item.key]" :disabled="item.disabledModify||disabledModify" 
              :placeholder="item.placeholder||''" @change="methodHandler($event, 'change', item)">
              <el-option  v-for="option in item.items" :key="option.value"  :label="option.label" :value="option.value" ></el-option>
            </el-select>

            <el-col :span="24" v-if="item.inputType === 'date'">
              <el-form-item prop="date1">
                <el-date-picker type="date"  :placeholder="item.placeholder||''" v-model="ruleForm[item.key]" :disabled="item.disabledModify||disabledModify" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="24" v-if="item.inputType === 'buttonInput'">
              <el-input  :placeholder="item.placeholder||''" v-model="ruleForm[item.key]" class="button-input">
                <el-button slot="append" :icon="button.icon"  v-for="button in item.items" :key="button.key"  @click="openDialog(item.key,button.key)"  :disabled="item.disabledModify||disabledModify"></el-button>
              </el-input>
            </el-col>

            <el-col :span="24" v-if="item.inputType === 'tipInput'">
              <el-col :span="24-item.items.length*1">
                  <el-input v-model="ruleForm[item.key]" :disabled="item.disabledModify||disabledModify" :placeholder="item.placeholder||''"></el-input>
              </el-col>
              <el-col :span="1" class="tip-input" v-for="tip in item.items" :key="tip.key">
                <el-tooltip class="item" :effect="tip.effect" :content="tip.content" :placement="tip.placement">
                  <el-button><i class="el-icon-info"></i></el-button>
                </el-tooltip>
              </el-col>
            </el-col>

            <el-switch v-model="ruleForm[item.key]" :disabled="item.disabledModify||disabledModify" v-if="item.inputType === 'switch'"></el-switch>

            <el-checkbox-group v-model="ruleForm[item.key]" :disabled="item.disabledModify||disabledModify" v-if="item.inputType === 'checkbox'">
              <el-checkbox  v-for="checkbox in item.items" :key="checkbox.label"  :label="checkbox.value" name="type">{{checkbox.label}}</el-checkbox>
            </el-checkbox-group>

            <el-radio-group v-model="ruleForm[item.key]" :disabled="item.disabledModify||disabledModify" v-if="item.inputType === 'radio'" >
              <el-radio  v-for="radio in item.items" :key="radio.label" :label="radio.value">{{radio.label}}</el-radio>
            </el-radio-group>

            <el-input type="textarea" v-model="ruleForm[item.key]" :disabled="item.disabledModify||disabledModify" v-if="item.inputType === 'textarea'"  :placeholder="item.placeholder||''" :rows="item.rows || 4" :resize="item.resize?'vertical':'none'"></el-input>

          </el-form-item>

          <el-col class="form-title" v-else-if="item.inputType === 'title'"><div :style="item.style">{{item.label}}</div></el-col>

        </el-col>

        <el-col v-if="!noButtonFlag" :span="24" class="footer-button" >
            <el-button v-if="!disabledModify" type="primary" @click="submitForm()" :size="size">{{submitBtnContext}}</el-button>
            <el-button @click="cancel()" :size="size">{{cancelBtnContext}}</el-button>
        </el-col>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Form",
  data() {
    return {
      ruleForm: {}
    };
  },
  created() {
    this.setDefaultValue();
  },
  computed: {
    rules() {
      const rules = {};
      this.formItems.forEach((element) => {
        element.rules && (rules[element.key] = element.rules);
      });
      return rules;
    }
  },
  props: {
    submitBtnContext: {
      type: String,
      default: '保存'
    },
    cancelBtnContext: {
      type: String,
      default: '关闭'
    },
    size: {
      type: String,
      default: 'medium',  // medium / small / mini
      validator: function(_s) {
        const sizes = ['medium', 'small', 'mini'];
        
        if (sizes.indexOf(_s) < 0) {
          console.error('size must be medium | small | mini');
          return false;
        }
        return true;
      }
    },
    labelLength: {
      type: String,
      default: '150px'
    },
    formItems: {
      type: Array,
      default: () => {
        return []
      }
    },
    disabledModify: {
      type: Boolean,
      default: false
    },
    noButtonFlag: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    setDefaultValue() {
      const _r = {};
      this.formItems.forEach(item => {
        _r[item.key] = item.value || '';
      });
      this.ruleForm = _r;
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit("submitForm", this.ruleForm);
        } else {
          this.$msg.warning('表单校验失败，无法进行下一步');
          return false;
        }
      });
    },
    cancel() {
      this.$emit("cancel");
    },
    openDialog(_itemKey, _buttonKey) {
      this.$emit("openDialog", _itemKey, _buttonKey);
    },
    updateValue(item) {
      for (const [key, value] of Object.entries(item)) {
        this.ruleForm && (this.ruleForm[key] = value);
      }
    },
    methodHandler(_e, _methodName, _obj) {
      if (!!_obj.event && !!_obj.event[_methodName]) {
        _obj.event[_methodName](_e);
      }
    },
    /** 表单 添加一项 */
    addItem(_option) {
      this.formItems.push(_option);
    },
    /** 表单 删除一项 */
    deleteItem(_key) {
      const one = this.formItems.find((item) => item.key === _key);
      const index = this.formItems.indexOf(one);
      this.formItems.splice(index, 1);
      delete this.ruleForm[_key];
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    getData() {
      return this.ruleForm;
    }
  },
};
</script>

<style lang="scss">
.custom-form {
  margin-top: 22px;
  width: 100%;
  .form-title {
    margin-bottom: 8px;
  }
  .button-input .el-button + .el-button {
    margin-left: 20px;
    border-left: 1px solid #dcdfe6;
  }
  .tip-input {
    text-align: right;
    .el-button {
      border: unset;
    }
  }
  .footer-button {
    text-align: center;
  }
  el-select-menu {
    position: absolute;
    z-index: 1001;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    margin: 5px 0;
    margin-top: 12px;
    width: 100%;
  }
  .el-select,
  .el-input {
    width: 100%;
  }
}
</style>
