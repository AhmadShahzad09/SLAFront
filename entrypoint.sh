#!/bin/sh

find /usr/share/nginx/html/js -type f | xargs -i sed -i -e "s|VUE_APP_CLIENT_ID_VALUE|${VUE_APP_CLIENT_ID_VALUE}|g" {}
find /usr/share/nginx/html/js -type f | xargs -i sed -i -e "s|VUE_APP_CLIENT_SECRET_VALUE|${VUE_APP_CLIENT_SECRET_VALUE}|g" {}
find /usr/share/nginx/html/js -type f | xargs -i sed -i -e "s|VUE_APP_TIMEZONE_VALUE|${VUE_APP_TIMEZONE_VALUE}|g" {}
find /usr/share/nginx/html/js -type f | xargs -i sed -i -e "s|VUE_APP_VERSION_VALUE|${VUE_APP_VERSION_VALUE}|g" {}
find /usr/share/nginx/html/js -type f | xargs -i sed -i -e "s|VUE_APP_API_URL_VALUE|${VUE_APP_API_URL_VALUE}|g" {}
find /usr/share/nginx/html/js -type f | xargs -i sed -i -e "s|VUE_APP_ENVIRONMENT_VALUE|${VUE_APP_ENVIRONMENT_VALUE}|g" {}

nginx -g "daemon off;"