import api from '@/config/Api'

const baseEndpoint = 'administration/execution'
const baseEndpoint2 = 'administration/audit'

export default {
  getExecutions(params) {
    return api.get(baseEndpoint, params)
  },

  createExecution(data) {
    return api.post(baseEndpoint, data)
  },

  updateExecution(id, data) {
    return api.put(`${baseEndpoint}/${id}`, data)
  },

  deleteExecution(id) {
    return api.delete(`${baseEndpoint}/${id}`)
  },

  getExecutionAudit(id) {
    return api.get(`${baseEndpoint2}/${id}`)
  }
}
