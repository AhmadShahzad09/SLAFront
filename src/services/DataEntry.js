import api from '@/config/Api'

const baseEndpoint = 'administration/data-entry'

export default {
  getDataEntry(params) {
    return api.get(baseEndpoint, params)
  },

  createDataEntry(data) {
    return api.post(baseEndpoint, data)
  },

  updateDataEntry(id, data) {
    return api.put(`${baseEndpoint}/${id}`, data)
  },

  deleteDataEntry(id) {
    return api.delete(`${baseEndpoint}/${id}`)
  }
}
