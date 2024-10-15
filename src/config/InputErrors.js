
const phoneFormat = /^!*([0-9]!*){10,10}$/g

export default {
  required: { required: true, message: 'errors.required', trigger: 'blur' },
  email: { type: 'email', message: 'errors.email', trigger: 'blur' },
  url: { type: 'url', message: 'errors.url', trigger: 'blur' },
  phone: { pattern: phoneFormat, message: 'errors.phone' },
  year: {
    validator (rule, value, callback) {
      return value >= 2000
    },
    message: 'greatherThan2000'
  },
  greatherThan0: {
    validator (rule, value, callback) {
      return value > 0
    },
    message: 'greatherThan0'
  },
  noDecimals: {
    validator (rule, value, callback) {
      return !value.includes('.')
    },
    message: 'noDecimal'
  }
}
