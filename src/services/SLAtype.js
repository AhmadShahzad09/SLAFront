import api from '@/config/Api'

const baseEndpoint = 'administration/type'

export default {
  getSLAtypes(params) {
    return api.get(baseEndpoint, params)
  },

  createSLAtype(data) {
    return api.post(baseEndpoint, data)
  },

  updateSLAtype(id, data) {
    return api.put(`${baseEndpoint}/${id}`, data)
  },

  deleteSLAtype(id) {
    return api.delete(`${baseEndpoint}/${id}`)
  }
}
