export default {
  set: (value) => localStorage.setItem('slatool', value),
  get: () => JSON.parse(localStorage.getItem('slatool')),
  clear: () => localStorage.removeItem('slatool')
}
