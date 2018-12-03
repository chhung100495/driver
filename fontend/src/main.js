import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import VeeValidate from 'vee-validate';
import id from './locale-id'

Vue.use(VeeValidate);
const rulesPlugin = ({ Validator }) => {
  Validator.localize('id', id);
};

VeeValidate.use(rulesPlugin);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
