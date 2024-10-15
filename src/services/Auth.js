import api from '@/config/Api'

export default {
  login (data) {
    return api.post('auth/login', {
      ...data,
      // client_id: process.env.VUE_APP_CLIENT_ID,
      // client_secret: process.env.VUE_APP_CLIENT_SECRET,
      // grant_type: 'password'
    })
  },
  recoverPass (data) {
    return api.post('oauth/recover-password', data)
  }
}
