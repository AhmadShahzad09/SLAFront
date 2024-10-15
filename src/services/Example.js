import api from '@/config/Api'
import apiTest from '@/config/ApiTest'

export default {
  getList (params) {
    return api.get('/administration/user', params)
  },

  getUser (id) {
    return api.get(`/administration/user/${id}`)
  },

  getConfig () {
    return api.get(`/administration/configuration`)
  },

  getZones () {
    return api.get(`/administration/zone`, { limit: 0 })
  },

  test (data) {
    return apiTest.post('/operation/ReadCard', {
      ...data,
    })
  },

  login (data) {
    return api.post('oauth/v2/token', {
      ...data,
      client_id: process.env.VUE_APP_CLIENT_ID,
      client_secret: process.env.VUE_APP_CLIENT_SECRET,
      grant_type: 'password'
    })
  }
}
