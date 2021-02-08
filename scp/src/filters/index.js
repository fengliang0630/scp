import Vue from 'vue'
import codeValues from '@/config/codeValue';

export default {
    install() {
        Vue.filter('codeValueFilter', function (_key, _types) {
            debugger;
            let retVal = _key;
            if (typeof(codeValues[_types][_key]) !== 'undefined') {
                retVal = codeValues[_types][_key];
            }
            return retVal;
        })
    }
}