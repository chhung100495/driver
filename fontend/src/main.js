import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import VeeValidate from 'vee-validate';
import id from './locale-id'
import * as VueGoogleMaps from 'vue2-google-maps'
import Notifications from 'vue-notification'

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyBkwRNAhT2ic6ZMR3i10ms51YhUJGHTXaQ",
    libraries: 'places'
  }
})

Vue.use(VeeValidate);
const rulesPlugin = ({ Validator }) => {
  Validator.localize('id', id);
};
VeeValidate.use(rulesPlugin);

Vue.use(ElementUI)

Vue.use(Notifications)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
