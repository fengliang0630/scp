<template>
  <div id="list" :class="['custom-list', className]" @click="showFilter = false">
    <div v-if="!!listConfig.formItems" class="custom-filter" @click="filterDivClick($event)">
      <div :class="{'filter-contain': true, 'closed': !showFilter}" class="filter-contain">
        <hoperun-form ref="filterForm" :formItems="formItems" size="mini" submitBtnContext="查询" cancelBtnContext="重置"
          @submitForm="submitForm" @cancel="cancel"></hoperun-form>
      </div>
      <div :class="{'filter-toggle': true, 'is-show': showFilter}">
        <hoperun-icon :class="{'filter-toggle-btn': true}" :icon="['fas', !showFilter ? 'angle-down' : 'angle-up']" @click="toggleFilter($event)"></hoperun-icon>
      </div>
    </div>
    <div>
      <div v-if="!!listConfig || $slots.top" class="btn-div">
        <div v-if="listConfig.buttons" class="custom-btn">
          <el-button v-for="b in listConfig.buttons" :key="b.label" type="primary" size="mini" @click="customEvent(b.handlerMethod)">{{b.label}}</el-button>
        </div>
        <div v-if="$slots.topBar" class="custom-btn">
          <slot name="topBar"></slot>
        </div>
      </div>
    </div>
    <el-table v-if="!!listConfig && !!listConfig.tableHeaders" class="custom-table" :data="tableData" :height="tableHeight" @selection-change="handleSelectionChange" style="width: 100%">
      <!-- 序号 -->
      <el-table-column v-if="isOrderNum" label="序号" width="100">
        <template slot-scope="scope">{{scope.$index+1}}</template>
      </el-table-column>
      <!-- 多选checkbox -->
      <el-table-column v-if="isCheckbox" type="selection" width="55"></el-table-column>
      <!-- 遍历表格内容 -->
      <el-table-column v-for="h in listConfig.tableHeaders" :key="h.prop" :prop="h.prop" :label="h.label" :width="h.width">
        <template slot-scope="scope">
          <slot v-if="h.isSlot" :name="h.prop" :row="scope.row" :index="scope.$index"></slot>
          <div v-if="!h.isSlot" v-html="scope.row[h.prop]"></div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="!!isPagination" ref="customPagination"
      class="custom-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import defaultListConfig from '@/config/listConfig';
import codeValue from '@/config/codeValue';

export default {
  name: "List",
  data() {
    return {
      showFilter: false,
      pageSize: defaultListConfig.pagination.size,
      pageSizes: defaultListConfig.pagination.sizes,
      multipleSelection: null,
      tableHeight: 0,
      currentPage: 1,
      tableData: [],
      total: 0,
    };
  },
  created() {
    this.listConfig.key = this.listConfig.key || 'id';
    if (!this.listConfig.formItems) {
      this.listConfig.buttons.push({ label: "查询", handlerMethod: "queryData" });
    }
  },
  props: {
    isPagination: {         // 表格是否需要分页
      type: Boolean,
      default: true
    },
    /**
     * buttons: Array,       // 表格外顶部按钮
     * tableHeaders: Array,    // 表格表头
     * formItems: Array       // 过滤条件配置
     * key: String,         // 唯一标识key
     */
    listConfig: {
      type: Object,
      required: true,
      validator: function(_obj) {
        if (!!_obj.key && typeof _obj.key !== 'string') {
          console.error('listConfig-key must be string');
          return false;
        }
        if (!_obj.tableHeaders || Object.prototype.toString.call(_obj.tableHeaders) !== '[object Array]') {
          console.error('listConfig-tableHeader is required and typeof is array');
          return false;
        }
        return true;
      }
    },
    isOrderNum: {           //  是否需要序号
      type: Boolean,
      default: true
    }, 
    isCheckbox: {           // 是否需要多选
      type: Boolean,
      default: false
    },
    listData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    className: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      const paginationHeight = this.isPagination ? 80 : 35;
      this.tableHeight = document.getElementById('list').offsetHeight - paginationHeight;
      this.tableData = this.listData;
    });
  },
  computed: {
    formItems() {
      const _formItems = this.listConfig.formItems;
      _formItems.forEach(item => {
        const obj = { colLength: 6 }
        if (item.inputType === 'select' && typeof item.items === 'string') {
          obj.items = [];
          for (let [value, label] of Object.entries(codeValue[item.items])) {
            obj.items.push({ label, value });
          }
        }
        Object.assign(item, obj);
      });
      return _formItems;
    }
  },
  methods: {
    filterDivClick(e) {
      e.stopPropagation();
    },
    toggleFilter(e) {
      this.showFilter = !this.showFilter;
      e.stopPropagation();
    },
    queryData() {
      const params = this.getQueryParams();
      this.$emit('queryData', params);
    },
    submitForm(_value) {
      this.pageSize = defaultListConfig.pagination.size;
      this.currentPage = 1;
      this.showFilter = false;
      this.queryData();
    },
    cancel() {
      this.$refs.filterForm.resetForm();
      this.pageSize = defaultListConfig.pagination.size;
      this.currentPage = 1;
      this.showFilter = false;
      this.queryData();
    },
    /** 自定义事件， 需要往父组件扔出去 */
    customEvent(_eventName) {
      const params = this.getQueryParams();
      if(this.isCheckbox) {
        this.$emit(_eventName, params, this.multipleSelection);
      } else {
        this.$emit(_eventName, params);
      }
    },
    handleSizeChange(_val) {
      this.pageSize = _val;
      this.currentPage = 1;
      this.queryData();
    },
    handleCurrentChange(_val) {
      this.currentPage = _val;
      this.queryData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /** 设置table表格数据 */
    setTableData(_tableData, _total) {
      this.tableData = _tableData;
      this.total = _total || 0;
    },
    /** 设置table表格数据 */
    addTableData(_obj) {
      this.tableData.push(_obj);
    },
    /** 删除表格数据 key  或者  obj  均可  */
    deleteTableData(_primaryValueOrObj) {
      let _obj = _primaryValueOrObj
      if (!(_primaryValueOrObj instanceof Object)) {
        _obj = this.tableData.find(_item => _item[this.listConfig.key] === _primaryValueOrObj);
      }
      const _index = this.tableData.indexOf(_obj);

      if (_index >= 0) {
        this.tableData = [...this.tableData.slice(0, _index), ...this.tableData.slice(_index+1)];
        return;
      }

      this.$msg.error('没有找到可以删除的对象');
    },
    /** 获取表格所有数据 */
    getTableDataList() {
      return this.tableData;
    },
    /** 获取表格具体数据   key  或者  obj  均可 */
    getTableData(_primaryValue) {
      if(!this.listConfig.key) return null;
      const _obj = this.tableData.find(_obj => _obj[this.listConfig.key] === _primaryValue);
      if (!_obj) {
        this.$msg.error('没有找到对应对象');
      }
      return _obj;
    },
    // 获取查询参数
    getQueryParams() {
      const params = {};
      // 存在分页的情况
      if (!!this.isPagination) {
        Object.assign(params, {size: this.pageSize, pageNum: this.currentPage});
      }

      if (!!this.listConfig.formItems) {
        Object.assign(params, this.$refs.filterForm.getData());
      }

      return params;
    }
  }
};
</script>

<style lang="scss">
.custom-list {
  height: 100%;
  overflow: hidden;
  position: relative;

  .custom-filter {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 10;
    overflow: hidden;

    .filter-contain {
      background-color: #fff;
      padding: 20px;
      overflow: hidden;
      box-shadow: 0 2px 4px #e7e7e7, 0 0 6px #fff;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      &.closed {
        padding: 0;
        height: 0;
      }
    }

    .filter-toggle {
      height: 5px;
      text-align: center;
      
      .filter-toggle-btn {
        width: 100px;
        height: 0;
        background-color: #e7e7e7;
        box-shadow: 0 2px 4px #e7e7e7, 0 0 6px #fff;
        cursor: pointer;
      }

      &:hover {
        height: 20px;
        .filter-toggle-btn {
          height: 20px;
        }
      }

      &.is-show {
        height: 20px;
        .filter-toggle-btn {
          height: 20px;
        }
      }
    }
  }

  .btn-div {
    padding: 3px;
    position: relative;
    height: 25px;
    .custom-btn {
      float: right;
      margin-right: 10px;
      height: 40px;
      line-height: 40px;
    }
  }

  .custom-table {
    .pointer {
      margin-left: 5px;
      &.disabled {
        color: #e0d6d6;
      }

      &:not(.disabled) {
        cursor: pointer;
        &:hover{
          font-size: 16px;
        }
      }
    }

    th, td {
      text-align: center!important;
    }

    margin-bottom: 30px;
  }

  .custom-pagination {
    position: absolute;
    right: 40px;
    bottom: 0px;
  }
}
</style>
