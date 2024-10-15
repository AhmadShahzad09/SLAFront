import api from '@/config/Api'

const baseEndpoint = 'administration/calculation-module'

export default {
  getCalculationModules(params) {
    return api.get(baseEndpoint, params)
  },

  createCalculationModule(data) {
    return api.post(baseEndpoint, data)
  },

  updateCalculationModule(id, data) {
    return api.put(`${baseEndpoint}/${id}`, data)
  },

  deleteCalculationModule(id) {
    return api.delete(`${baseEndpoint}/${id}`)
  }
}
