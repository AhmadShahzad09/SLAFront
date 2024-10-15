import api from '@/config/Api'

const baseEndpoint = 'administration/data-type'

export default {
  getDataType(params) {
    return api.get(baseEndpoint, params)
  },

  createDataType(data) {
    return api.post(baseEndpoint, data)
  },

  updateDataType(id, data) {
    return api.put(`${baseEndpoint}/${id}`, data)
  },

  deleteDataType(id) {
    return api.delete(`${baseEndpoint}/${id}`)
  }
}
