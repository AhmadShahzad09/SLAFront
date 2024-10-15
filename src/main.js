import Vue from 'vue'
import CompositionApi from '@vue/composition-api'
import App from './App.vue'
import { closest } from './utils/ie'
import router from './router/index'
import i18n from './lang/i18n.js'
import store from './store'

import '@/filters/filters'
import ODS from '@/components/index.js'

closest()
Vue.config.productionTip = false

Vue.use(CompositionApi)

Vue.use(ODS, {
  i18n: (key, value) => i18n.t(key, value)
})

new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')
