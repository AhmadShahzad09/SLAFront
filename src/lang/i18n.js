import Vue from 'vue'
import VueI18n from 'vue-i18n'
import esLocale from './locale/es'
import enLocale from './locale/en'

Vue.use(VueI18n)

const messages = {
  es: esLocale,
  en: enLocale
}

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages
})

export default i18n
