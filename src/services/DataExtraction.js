import api from '@/config/Api'

const baseEndpoint = 'load/custom-filters'
const baseEndpoint2 = 'load/actions'

export default {
  getDataExtractions(params) {
    return api.get(baseEndpoint, params)
  },

  createExecution(db, start, end) {
    return api.post(`${baseEndpoint2}/${db}?startDate=${start}&endDate=${end}`)
  }
}
