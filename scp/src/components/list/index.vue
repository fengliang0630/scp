<template>
  <div id="list" :class="['custom-list', className]" @click="showFilter = false">
    <div v-if="!!listConfig.formItems" class="custom-filter" @click="filterDivClick($event)">
      <div :class="{'filter-contain': true, 'closed': !showFilter}" class="filter-contain">
        <scp-form ref="filterForm" :formItems="formItems" size="mini" submitBtnContext="查询" cancelBtnContext="重置"
          @submitForm="submitForm" @cancel="cancel"></scp-form>
      </div>
      <div :class="{'filter-toggle': true, 'is-show': showFilter}">
        <scp-icon :class="{'filter-toggle-btn': true}" :icon="['fas', !showFilter ? 'angle-down' : 'angle-up']" @click="toggleFilter($event)"></scp-icon>
      </div>
    </div>
    <div v-if="!!listConfig || $slots.top" class="btn-div">
      <div v-if="listConfig.buttons" class="custom-btn">
        <el-button v-for="b in listConfig.buttons" :key="b.label" type="primary" size="mini" @click="customEvent(b.handlerMethod)">{{b.label}}</el-button>
      </div>
      <div v-if="$slots.topBar" class="custom-btn">
        <slot name="topBar"></slot>
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
          <div v-else-if="!h.isSlot && !h.codeValueKey" v-html="scope.row[h.prop]"></div>
          <div v-else-if="!h.isSlot && h.codeValueKey">
            <span>{{scope.row[h.prop] | codeValueFilter(h.codeValueKey, scope.row[h.prop])}}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="!!isPagination.pagination" class="custom-pagination-div">
      <el-pagination ref="customPagination"
        class="custom-pagination"
        :background="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <scp-icon v-if="!!isPagination.exportCurrent" title="导出当前页" :icon="['fas', 'file-export']" class="download-btn" @click="exportCurrentPageHandler"></scp-icon>
    </div>
  </div>
</template>

<script>
import defaultListConfig from '@/config/listConfig';
import codeValue from '@/config/codeValue';
import xlsxUtils from '@/utils/xlsx';
import { codeValueFilter } from '@/filters/filter';

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
    exportName: {
      type: String,
      default: '导出数据'
    },
    isPagination: {         // 表格是否需要分页
      type: Object,
      default: () => {
        return {
          pagination: true,
          exportCurrent: true
        }
      }
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
    // 到处当前页  待处理
    exportCurrentPageHandler() {
      this.exportData(this.tableData, `${this.exportName}（当前页）`);
    },
    exportData(_tableData, _fileName) {
      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const tbody = document.createElement('tbody');
      const header_tr = document.createElement('tr');

      _tableData.forEach((_data, _index) => {
        const body_tr = document.createElement('tr');
        this.listConfig.tableHeaders.forEach(header => {
          if (!!header.noExport) {
            return;
          }

          if (_index === 0) {
            const th = document.createElement('th');
            const text = document.createTextNode(header.label);
            th.appendChild(text);
            header_tr.appendChild(th);
            thead.appendChild(header_tr);
          }

          const td = document.createElement('td');
          td.setAttribute('t', 's');
          const textTem = !!header.codeValueKey ? codeValueFilter(_data[header.prop], header.codeValueKey) : _data[header.prop];
          const body_text = document.createTextNode(textTem);
          td.appendChild(body_text);
          body_tr.appendChild(td);
        });
        tbody.appendChild(body_tr);
      });
      
      table.appendChild(thead);
      table.appendChild(tbody);
      xlsxUtils.exportExcelByTable(table, _fileName);
    },
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
@import "@/../styles/variables.scss";
.custom-list {
  min-height: $base-app-main-height;
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
  }

  .custom-pagination-div{
      position: relative;
      height: 35px;
    .custom-pagination {
      position: absolute;
      right: 40px;
      bottom: 0px;
    }

    .download-btn {
      position: absolute;
      right: 17px;
      bottom: 8px;
      font-size: 16px;
      cursor: pointer;
      &:hover {
        color: #5470c6;
      }
    }
  }
  
}
</style>
