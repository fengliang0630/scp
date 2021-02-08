import api from '@/api';
const Mock = require('mockjs')

Object.keys(api).forEach(key => {
    Object.keys(api[key]).forEach(_key => {
        Mock.mock(api[key][_key].mockUrl, 'post', require(`./data/${key}/${_key}`))
    });
});