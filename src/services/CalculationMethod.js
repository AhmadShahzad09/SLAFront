import api from '@/config/Api'

const baseEndpoint = 'administration/calculation-methods'

export default {
  getCalculationMethods(params) {
    return api.get(baseEndpoint, params)
  },

  createCalculationMethod(data) {
    return api.post(baseEndpoint, data)
  },

  updateCalculationMethod(id, data) {
    return api.put(`${baseEndpoint}/${id}`, data)
  },

  deleteCalculationMethod(id) {
    return api.delete(`${baseEndpoint}/${id}`)
  }
}
