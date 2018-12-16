import Vue from 'vue'

import VeeValidate from 'vee-validate';
import id from '../locale-id'

Vue.use(VeeValidate);
const rulesPlugin = ({ Validator }) => {
  Validator.localize('id', id);
};
VeeValidate.use(rulesPlugin);