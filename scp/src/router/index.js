import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/login';
import Layout from '../components/Layout';
import Home from '../components/home';
import Store from '@/store';

//在路由跳转的时候同一个路由多次添加是不被允许的
//重写路由的push方法
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
    return VueRouterPush.call(this, to).catch(err => err)
}

Vue.use(Router);

const router = new Router({
  routes: [
    { path: '', redirect: '/home' },
    { path: '/login', name: 'login', component: Login },
    { path: '/', name: 'layout0', meta: {title: '首页'}, component: Layout, children: [
      { path: 'home', name: 'home', component: Home }
    ] }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next(); 
  } else {
    const obj = JSON.parse(sessionStorage.getItem("cacheData")) || Store.state;
    !!obj.user.userInfo ? next() : next({ name: 'login' })
  }   
})

router.addRoutes([
  { path: '/base', name: 'base', meta: {title: '基础支撑'}, component: ()=> import('../components/Layout'), children: [
    { path: 'user', name: 'user', meta: {title: '用户管理'}, component: ()=> import('../views/base/user') },
    { path: 'role', name: 'role', meta: {title: '角色管理'}, component: ()=> import('../views/base/role') },
    { path: 'menu', name: 'menu', meta: {title: '菜单管理'}, component: ()=> import('../views/base/menu') },
    { path: 'dept', name: 'dept', meta: {title: '部门管理'}, component: ()=> import('../views/base/dept') }
  ] }
])



export default router;
