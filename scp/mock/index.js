import api from '@/api';
const Mock = require('mockjs')

Object.keys(api).forEach(key => {
    Object.keys(api[key]).forEach(_key => {
        let data;
        try {
            data = require(`./data/${key}/${_key}`);
        } catch(e) {
            data = require(`./data/common/success`);
        }
        Mock.mock(api[key][_key].mockUrl, 'post', data)
    });
});