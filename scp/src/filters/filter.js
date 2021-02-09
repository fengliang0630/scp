import codeValues from '@/config/codeValue';

const codeValueFilter = (_key, _types) => {
    let retVal = _key;
    if (typeof(codeValues[_types][_key]) !== 'undefined') {
        retVal = codeValues[_types][_key];
    }
    return retVal;
}

export { codeValueFilter };