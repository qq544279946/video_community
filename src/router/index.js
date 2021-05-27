import Vue from 'vue'
import VueRouter from 'vue-router'
import M from '../views/M.vue'
import MHome from '../views/MHome.vue'
import MChannel from '../views/MChannel.vue'

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push;

//获取原型对象上的push函数
const originalReplace = VueRouter.prototype.push;

//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}

//修改原型对象中的replace方法
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err);
}

Vue.use(VueRouter)



const routes = [{
    path: '/',
    redirect: '/m/home'
  },
  {
    path: '/m',
    name: 'm',
    component: M,
    children: [{
        path: '/m/home',
        name: 'home',
        component: MHome,
        alias: '/home'
      },
      {
        path: '/m/channel/:id',
        name: 'channel',
        component: MChannel,
        alias: '/channel'
      }
    ]
  },
  {
    path: '/space',
    name: 'space',
    component: () => import( /* webpackChunkName: "space" */ '../views/Space.vue')
  },
  {
    path: '/space/:id',
    name: 'space2',
    component: () => import( /* webpackChunkName: "space" */ '../views/Space.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import( /* webpackChunkName: "search" */ '../views/Search.vue')
  },
  {
    path: '/comment',
    name: 'comment',
    component: () => import( /* webpackChunkName: "comment" */ '../views/Comment.vue')
  },
  {
    path: '/video',
    name: 'video',
    component: () => import( /* webpackChunkName: "video" */ '../views/VideoView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import( /* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import( /* webpackChunkName: "register" */ '../views/Register.vue')
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import( /* webpackChunkName: "upload" */ '../views/Upload.vue')
  },
  {
    path: '/*',
    name: '404',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( /* webpackChunkName: "about" */ '../views/404.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router