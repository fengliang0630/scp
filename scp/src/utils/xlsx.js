import XLSX from 'xlsx';
import FileSaver from 'file-saver';

/**
 * xlsx 操作工具
 */
export default {
  exportExcelByTable(table, fileName) {
    const wb = XLSX.utils.table_to_book(table);
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, `${fileName}.xlsx`);
  }
}