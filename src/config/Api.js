import { create } from 'apisauce'
import _ from 'lodash'
import storage from '../utils/storage'

const api = create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 600000
})

api.addRequestTransform((request) => {
  const accessToken = _.get(storage.get(), 'user.data.token')
  if (accessToken) request.headers.Authorization = `Bearer ${accessToken}`
})

api.addResponseTransform((response) => {
  const { data, ok } = response

  if (!ok) {
    let errors = ''

    if (response && response.status === 500) {
      return window.location.replace('/auth/login')
    }

    if (data) {
      if (data.errors || (data.form && data.form.errors)) {
        const formErrors = data.errors || data.form.errors
        if (_.isObject(formErrors) && !_.isArray(formErrors)) {
          errors = []
          _.map(formErrors, (error, key) => {
            if (_.isString(error)) errors.push(error)
            else if (_.isArray(errors)) {
              errors.push(`${key.toUpperCase()} <br/> ${error.join('<br/>')}`)
            }
          })
          errors = errors.join('<br/>')
        } else if (_.isArray(formErrors)) {
          errors = formErrors.join('<br/>')
        } else {
          errors = formErrors
        }
      } else if (data.message) errors = data.message
      else errors = data
    }

    if (!errors || _.isEmpty(errors)) errors = 'apiError'
    if (response.config.method === 'get' && !_.isString(errors)) response.errors = 'apiError'
    else response.errors = errors
  }
})

export default api
