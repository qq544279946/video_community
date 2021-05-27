import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './permission.js'



Vue.config.ignoredElements = [
  'e-player'
]
// 引入ui组件
import './plugin/index.js'

//引入css变量
import './assets/css/variable.css'

// 初始化样式
import './assets/css/reset.css'

// 引入字体图标
import './assets/icon/icon.css'


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
