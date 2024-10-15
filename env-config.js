const serverApiUrl = 'API_URL'
const controlApiUrl  = 'APIURL'
 
const getApiUrl= () => {
  return serverApiUrl.replaceAll('_', '') !== controlApiUrl
    ? serverApiUrl
    : process.env.VUE_APP_API_URL
}
 
export {
    getApiUrl
}

const serverTimeZone = 'TIME_ZONE'
const controlTimeZone = 'TIMEZONE'
 
const getTimeZone = () => {
  return serverTimeZone.replaceAll('_', '') !== controlTimeZone
    ? serverTimeZone
    : process.env.VUE_APP_TIMEZONE
}
 
export {
    getTimeZone
}


const serverClientId = 'CLIENT_ID'
const controlClientId = 'CLIENTID'
 
const getClientId= () => {
  return serverClientId.replaceAll('_', '') !== controlClientId
    ? serverClientId
    : process.env.VUE_APP_CLIENT_ID
}
 
export {
    getClientId
}


const serverClientSecret = 'CLIENT_SECRET'
const controlClientSecret = 'CLIENTSECRET'
 
const getClientSecret= () => {
  return serverClientSecret.replaceAll('_', '') !== controlClientSecret
    ? serverClientSecret
    : process.env.VUE_APP_CLIENT_SECRET
}
 
export {
    getClientSecret
}

const serverVersion = 'VERSION'
const controlVersion = 'VERSION'
 
const getVersion= () => {
  return serverVersion.replaceAll('_', '') !== controlVersion
    ? serverVersion
    : process.env.VUE_APP_VERSION
}
 
export {
    getVersion
}


const serverEnvironment = 'ENVIRONMENT'
const controlEnvironment = 'ENVIRONMENT'
 
const getEnvironment= () => {
  return serverEnvironment.replaceAll('_', '') !== controlEnvironment
    ? serverEnvironment
    : process.env.VUE_APP_ENVIRONMENT
}
 
export {
    getEnvironment
}