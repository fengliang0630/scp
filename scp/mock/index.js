import api from '@/api';
const Mock = require('mockjs')

// 登陆
Mock.mock(api.login.mockUrl, 'post', require('./data/login'))

// 查询菜单树
Mock.mock(api.queryMenuData.mockUrl, 'post', require('./data/queryMenuData'))