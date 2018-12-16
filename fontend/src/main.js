import Vue from 'vue'
import App from './App.vue'
import router from './router'
import utils from './utils'
import './plugins/bootstrap-vue'
import './plugins/vee-validate'
import './plugins/vue2-google-maps'
import './plugins/element-ui'
import './plugins/vue-notification'

Vue.config.productionTip = false

Vue.mixin(utils)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
