import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { Route404 } from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; 
import * as echarts from 'echarts'
import request from '@/utils/request'
import VueSocketIo from 'vue-socket.io'



import 'normalize.css/normalize.css'
import 'font-awesome/css/font-awesome.min.css'


import zhLocale from 'element-ui/lib/locale/lang/en';
Vue.use(ElementUI, {
  locale: zhLocale,
});
zhLocale.el.pagination =  {
    goto: 'Go to',
    pagesize: '/page',
    total: 'Total {total}',
    pageClassifier: ''
  };

Vue.config.productionTip = false;
Vue.use(ElementUI, {
    size: 'mini'
});

Vue.use(new VueSocketIo({
    debug: true,
    connection: 'http://localhost:8080'
}))

//白名单：不作权限校验
//Whitelist: Do not perform permission verification
const whiteList = ['/login']


//使用钩子函数对路由进行权限跳转
//Use hook functions to perform permission jumps on routes
router.beforeEach(async(to, from, next) => {

    document.title = `${to.meta.title} | Library system`;
    let userJson = localStorage.getItem("user");

    if(userJson){
        if(to.path === '/login'){
            next();
        }else{
            if(store.state.routes && store.state.routes.length > 0){
                next()
            }else{
                let user = JSON.parse(userJson);
                let role = user.role == 0 ? "admin" : "user";
                const accessRoutes = await store.dispatch('generateRoutes', [role])
                router.addRoutes(accessRoutes);
                //动态引入404路由
                //Dynamic introduction of 404 routing
                router.addRoute(Route404);
                //确保addRoutes操作完成
                //Ensure that the addRoutes operation is completed
                next({ ...to, replace: true })
            }
        }
    }else{
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next('/login')
        }
    }
});

new Vue({
    router,
    store,
    render: h => h(App),
    beforeCreate() {
        Vue.prototype.$echarts = echarts //全局引入//echartsGlobal introduction of echarts
        Vue.prototype.$bus = this // 事件总线 //Event bus
        Vue.prototype.$http = request       //全局引入axios //Global introduction of axios
      },
}).$mount('#app');
