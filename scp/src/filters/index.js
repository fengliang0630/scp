import Vue from 'vue'
import { codeValueFilter } from './filter';

export default {
    install() {
        Vue.filter('codeValueFilter', codeValueFilter);
    }
}