import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import common from './locales/pt-BR/common.json'
import tuner from './locales/pt-BR/tuner.json'
import commonEn from './locales/en-US/common.json'
import tunerEn from './locales/en-US/tuner.json'

export const supportedLanguages = [
  { code: 'pt-BR', labelKey: 'common:language.portuguese' },
  { code: 'en-US', labelKey: 'common:language.english' },
] as const

i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { common, tuner },
    'en-US': { common: commonEn, tuner: tunerEn },
  },
  lng: 'pt-BR',
  fallbackLng: 'pt-BR',
  interpolation: { escapeValue: false },
})

export default i18n
