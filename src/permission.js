import router from './router'
import Cookies from 'js-cookie'
import store from './store'

import {
    getUserInfo
} from './api/user.js'

// 需要权限的路由白名单
const whiteList = ['^/space$', '/upload','/comment'];

router.beforeEach(async function (to, from, next) {
    console.log(to.path)

    const cookie = Cookies.get('token');
    console.log('cookie', cookie)
    if (cookie) {
        if (store.state.user === null) {
            const res = await getUserInfo();
            if (res.code === '200') {
                const user = res.data;
                store.commit('setUser', user);
                next();
            } else {
                Cookies.remove('token')
                if (whiteList.findIndex(item => (new RegExp(item)).test(to.path)) === -1) {
                    next()
                } else {
                    next('/login')
                }
            }
        } else {
            next();
        }

    } else {
        if (whiteList.findIndex(item => (new RegExp(item)).test(to.path)) === -1) {
            next()
        } else {
            next('/login')
        }

    }

})