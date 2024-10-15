import api from '@/config/Api'

const baseEndpoint = 'administration/calculation-result'

export default {
  getCalculationResults(lastExecution) {
    return api.get(`${baseEndpoint}?last=${lastExecution.lastExecution ? 'true' : 'false'}`)
  },

  getDailyCalculationResults(params) {
    return api.get(baseEndpoint, params)
  },

  getCalculationResultsReport(params) {
    return api.get(`${baseEndpoint}-report`, params)
  },

  getNonCompliantData(id) {
    // 'https://api.slatool.cencoapps.com/administration/calculation-result/failed/15861'
    // return api.get('https://api.slatool.cencoapps.com/administration/calculation-result/failed/15005')
    return api.get(`${baseEndpoint}/failed/${id}`)
  },

  getZones() {
    return api.get(`${baseEndpoint}/zone`)
  },

  getMonthlyCalculationResults(lastExecution) {
    return api.get(`${baseEndpoint}-monthly?last=${lastExecution.lastExecution ? 'true' : 'false'}`)
  },
  getCalculateMonth(month, year) {
    return api.get(`administration/executeResultMonthly?year=${year}&month=${month}`)
  },

  createCalculationResult(data) {
    return api.post(baseEndpoint, data)
  },

  updateCalculationResult(id, data) {
    return api.put(`${baseEndpoint}/${id}`, data)
  },

  deleteCalculationResult(id) {
    return api.delete(`${baseEndpoint}/${id}`)
  },

  getReport(id) {
    return api.get(`${baseEndpoint}/report/${id}`)
  }
}
