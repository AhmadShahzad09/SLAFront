import api from '@/config/Api'

const baseEndpoint = 'administration/schedule'

export default {
  getSchedule(params) {
    return api.get(baseEndpoint, params)
  },

  createSchedule(data) {
    return api.post(baseEndpoint, data)
  },

  updateSchedule(id, data) {
    return api.put(`${baseEndpoint}/${id}`, data)
  },

  deleteSchedule(id) {
    return api.delete(`${baseEndpoint}/${id}`)
  }
}
