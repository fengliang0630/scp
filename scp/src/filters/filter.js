import codeValues from '@/config/codeValue';

const codeValueFilter = (_value, _codeValueKey) => {
    const option = codeValues[_codeValueKey];
    for (let [label, value] of Object.entries(option)) {
       if (value === _value) {
            return label;
       }
    }
    return _value;
}

export { codeValueFilter };