// vant ui库的引入文件

import Vue from 'vue'
import {
    Button,
    Tab,
    Tabs,
    Popup,
    Cell,
    CellGroup,
    DatetimePicker,
    Form,
    Field,
    Uploader,
    Cascader,
    Toast 
} from 'vant'

Vue.use(Button)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Popup)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(DatetimePicker)
Vue.use(Form)
Vue.use(Field)
Vue.use(Uploader)
Vue.use(Cascader)
Vue.use(Toast)

Vue.prototype.$message = Toast;