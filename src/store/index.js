import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import omit from 'lodash/omit'

import settings from './modules/settings'
import exports from './modules/export'
import user from './modules/user'
import userRoles from './modules/userRoles'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  key: 'slatool',
  reducer: state => {
    return omit(state, ['settings.alert'])
  }
})

export default new Vuex.Store({
  modules: {
    exports,
    settings,
    user,
    userRoles
  },
  strict: debug,
  plugins: [vuexLocal.plugin]
})
