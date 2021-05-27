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
    Toast,
    Progress,
    Lazyload,
    Popover
} from 'vant'

import ColorPicker  from 'heyui/lib/components/color-picker';
import Slider from 'heyui/lib/components/slider'
Vue.component('ColorPicker', ColorPicker);
Vue.component('Slider', Slider);
Vue.use(Lazyload);
Vue.use(Progress);
Vue.use(Popover);

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