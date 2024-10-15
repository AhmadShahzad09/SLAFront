> A private Vue.js 2.0 Design System for Onesait.

## Install
node->12.14.1
npm i --save

## Browser Support
Modern browsers and Internet Explorer 11+.

## Links

* [CHANGELOG](https://gitlab-ssdd.onesaitplatform.com/onesait/onesait-ux/ods/blob/develop/CHANGELOG.md)
* [CONTRIBUTING](https://gitlab-ssdd.onesaitplatform.com/onesait/onesait-ux/ods/blob/develop/CONTRIBUTING.md)

## .env file 
Content Example
```
VUE_APP_VERSION=1.0
VUE_APP_ENVIRONMENT=DEV
```

## API connection conf file 
Inside the public folder edit the envConfig.js file
```
VUE_APP_API_URL= https://api.slatool.cencoapps.com/
VUE_APP_CLIENT_ID=<VALUE>
VUE_APP_CLIENT_SECRET=<VALUE>
```
## Dev
node->12.14.1
run in local-> npm run dev

## Prod
run in the terminal:
npm run prod

## Create Docker Image
run in the terminal:

```
docker-compose build --no-cache sla_web &&  docker-compose up -d  sla_web
```

With custom port use SLA_WEB_PORT var:

```
export SLA_WEB_PORT=9999 && docker-compose build --no-cache sla_web &&  docker-compose up -d  sla_web
```


