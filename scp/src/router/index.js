import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/login';
import Demo from '../components/demo';
import Layout from '../components/Layout';

//在路由跳转的时候同一个路由多次添加是不被允许的
//重写路由的push方法
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
    return VueRouterPush.call(this, to).catch(err => err)
}

Vue.use(Router);
const router = new Router({
  routes: [
    { path: '', redirect: '/demo1' },
    { path: '/login', name: 'login', component: Login },
    { path: '/demo1', name: 'layout1', meta: {title: '测试1'}, component: Layout, children: [
      { path: 'demo', name: 'demo1', meta: {title: '测试11'}, component: Demo }
    ] },
    { path: '/demo2', name: 'layout2', meta: {title: '测试2'}, component: Layout, children: [
      { path: 'demo', name: 'demo2', meta: {title: '测试2-1'}, component: Demo }
    ] },
  ]
});

export default router;
