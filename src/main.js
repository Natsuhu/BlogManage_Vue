import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'

//a modern alternative to CSS resets
import 'normalize.css/normalize.css' 
//element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//global css
import '@/assets/styles/index.scss' 
//icon
import '@/icons' 
//base css
import './assets/styles/base.css'

//mavonEditor
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

//v-viewer
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'

Vue.use(mavonEditor)
Vue.use(ElementUI)
Vue.use(Viewer)

//全局变量
Vue.prototype.msgSuccess = function (msg) {
	this.$message.success(msg)
}
//全局变量
Vue.prototype.msgError = function (msg) {
	this.$message.error(msg)
}

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
