import api from '@/config/Api'

const baseEndpoint = 'administration/calculation-objective'

export default {
  getObjetives(params) {
    return api.get(baseEndpoint, params)
  },

  createObjetive(data) {
    return api.post(baseEndpoint, data)
  },

  updateObjetive(id, data) {
    return api.put(`${baseEndpoint}/${id}`, data)
  },

  deleteObjetive(id) {
    return api.delete(`${baseEndpoint}/${id}`)
  }
}
