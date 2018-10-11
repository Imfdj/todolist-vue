import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export const routers = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/pages/Home')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/Login')
    },
];
const router = new Router({
    routes: routers,
});
router.beforeEach((to, from, next) => {
    //to: Route: 即将要进入的目标 路由对象
    //from: Route: 当前导航正要离开的路由
    //next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
    //console.log(to.path);
    console.log(to.path);
    if (to.path == '/login') {
        next();
    } else {
        // 如果是其他页面跳转到登录页面，保存到lastPath
        if (localStorage.getItem('todolist_user')) {
            next();
        } else {
            console.log('需要重新登录，sessionStorage不存在');
            next({
                path: '/login'
            })
        }

    }

});

export default router;
