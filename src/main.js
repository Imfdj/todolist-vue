// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import qs from 'qs'
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './store'
import ElementUI from 'element-ui'
import dayjs from 'dayjs'

import {LoadingBar} from 'iview'
Vue.component('LoadingBar', LoadingBar)

import 'element-ui/lib/theme-chalk/index.css'
import '../static/fonts/iconfont/iconfont.css'

Vue.use(ElementUI);
Vue.use(Vuex);

Vue.config.productionTip = false
Vue.prototype.dayjs = dayjs;
Vue.prototype.$bus = new Vue();

/* eslint-disable no-new */
let vx = new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
})

import Axios from 'axios'
// import Axios from './assets/js/axios'

// 拦截request,设置全局请求为ajax请求
Axios.interceptors.request.use((config) => {
    LoadingBar.destroy();
    LoadingBar.start();
    if (config.method.toUpperCase() == 'POST' || config.method.toUpperCase() == 'DELETE' || config.method.toUpperCase() == 'PUT') {
        config.data = qs.stringify(config.data)
    }
    return config
});
Axios.interceptors.response.use((response) => {
    LoadingBar.finish();
    const data = response.data;
    if (data) {
        if (data.code == 401) {
            // if(response.config.method.toLowerCase() === 'get') {
            //     store.commit('response_configPush', response.config);
            // }
            // store.commit('isRegisterChange', true);
            console.log('没有登录， 不能调用');
            router.push({
                path: '/login'
            })
        }
    }
    return response
});
Vue.prototype.$http = Axios;
