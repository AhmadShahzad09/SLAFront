# Migración librería Ods v2

## Nexus	
Todos los productos Onesait deben publicar sus artefactos binarios en el servidor Nexus oficial de la compañía para que el resto de productos puedan reutilizar dichos artefactos

Nexus está configurado para hacer de proxy al repositorio npm principal (https://registry.npmjs.org). También permite almacenar artefactos propios para poder después descargarlos en otros entornos.

Para definir a Nexus como repositorio principal para la descarga de paquetes y artefactos hay que crear un fichero .npmrc con el siguiente contenido en la raiz del proyecto:

```js

registry=https://nexus.devops.onesait.com/repository/npm-all/
_auth=b25lc2FpdG5leHVzOm9uZXNhaXRuZXh1cw==
 
// Always require authentication when accessing the registry, even for GET requests
always-auth=true
 
// Whether or not to do SSL key validation when making requests to the registry via https.
strict-ssl=false
```

## Cambios en el `package.json` del proyecto.

``` javascript
// versión 1
'@onesait/onesait-ds': '^1.1.1'

// Versión 2
'@onesait/ods': '^2.1.0'
```

Eliminar la dependencia del reset-css
```js
import 'reset-css/reset.css'
```

## Cambios en el `main.js` del proyecto

Cambiar las dependencias tanto de la librería `ODS` como de los estilos.

```js
// versión 1
import ODS from '@onesait/onesait-ds'
import '@onesait/onesait-ds/lib/theme-onesait/index.css'

// Versión 2
import ODS from '@onesait/ods'
import '@onesait/ods/lib/theme-onesait/index.css'
```

Incorporamos la traducción de los `i18n` al inicializar la librería.

```js
// versión 1
Vue.use(ODS)

// Versión 2
Vue.use(ODS, {
  i18n: (key, value) => i18n.t(key, value)
})

```

Eliminar la importación del reset.css
```js
import 'reset-css/reset.css'
```

### Si el proyecto requiere un *custom theme*

**Si aplicamos un custom theme a nuestro proyecto** e importamos los estilos en nuestro `main.scss`, al igual que anteriormente, la linea del `main.js` de estilos (*index.css*) la dejaremos comentada o eliminada, con la importación de la librería ODS en el `main.js` es suficiente.

```js
import ODS from '@onesait/ods'
// import '@onesait/ods/lib/theme-onesait/index.css'
```

En la referencia a la variable de la fuente, realizamos el siguiente cambio (por defecto en `_variables.scss`)

```scss
// $--font-path: '~@onesait/onesait-ds/lib/theme-onesait/fonts'; 
$--font-path: '~@onesait/ods/packages/theme-onesait/src/fonts'; 
```

y en nuestro `main.scss` donde importamos los archivos *scss*, la ruta tiene ser la siguiente:

```scss
@import "~@onesait/ods/packages/theme-onesait/src/index";
```

## Revisar la configuración de `i18n`:
### Configuración principal.
src\lang\i18n.js 

```js
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import esLocale from './locale/es'
import enLocale from './locale/en'

Vue.use(VueI18n)

const messages = {
  es: esLocale,
  en: enLocale
}

const i18n = new VueI18n({
  locale: 'es',
  messages
})

export default i18n
```

### Ficheros de locales 

Cambiar la ruta en todos los ficheros locales del proyecto.

src\lang\locale\en.js<br>
src\lang\locale\es.js<br>
...

``` js
import enLocale from '@onesait/ods/lib/locale/lang/en'
 
export default {
  ...enLocale,
  label: 'English',
  labelMobile: 'EN',
  serverError: 'Unexpected server error. Try again.',
  breadcrumb: {
    home: 'Home',
    dashboard: 'Dashboard',
    tasks: 'Tasks',
    users: 'Users',
    randomUser: 'Random user ',
    randomString: 'Random string param: ',
    editProfile: 'Edit user',
    myUser: 'My user',
    editUser: 'Edit user'
  }
}
```

## Cambios en el `vue.config` para que las variables `scss` apunten a la ruta correcta.

```js
.options({
  resources: [
    // node_modules/@onesait/onesait-ds/packages/theme-onesait/src/common/var.scss' // Antigua
    'node_modules/@onesait/ods/packages/theme-onesait/src/common/var.scss' // Versión 2
    'src/assets/scss/base/_variables.scss',
    'src/assets/scss/base/_mixins.scss',
    'src/assets/scss/base/_typography-placeholder.scss'
  ]
})
```
## Cambio de `naming` en la importación de los componentes de manera individual

A partir de ahora llamaremos a los componentes con el prefijo `Ods`

```js
// Versión 1
import { Notification, Loading } from '@onesait/onesait-ds'

// Versión 2
import { OdsNotification, OdsLoading } from '@onesait/ods'
```

## Añadir prefijo a las `directivas`

las directivas internas de la librería deberán llevar también el prefijo `ods`

```js
// Versión 1
v-infinite-scroll="load"

// Versión 2
v-ods-infinite-scroll="load"
```

Sin embargo, las directivas que las carguemos individualmente de los archivos alojados de la librería seguirán funcionando de la misma manera ya que nos corresponde a nosotros nombrarlas en donde la usemos:
`
```js
import Clickoutside from '@onesait/ods/lib/utils/clickoutside.js'

directives: {
  'click-outside': Clickoutside
}
```

```html
<div v-click-outside="testDirective">test box</div>
```


## Otros aspectos a destacar

* Revisar cualquier ruta que indique al paquete `onesait/onesait-ds` y sustituirlo por `onesait/ods`
* Revisar donde se use algún 'util' y cambiar la ruta de la dependencia `onesait/onesait-ds` por `onesait/ods`

<br />

<hr>

<br />

# Migración de proyecto con Nuxt

Añadiremos `'@onesait/ods': '^2.1.0'` al package.json del proyecto.

A continuación crearemos un `ods.js` dentro de la carpeta plugins, donde importaremos *Vue* y la librería *ODS*.


```js
import Vue from 'vue'
import ODS from '@onesait/ods'
```

Además, inicializaremos la librería con las traducciones incorporadas

```js
export default ({ app }) => {
  Vue.use(ODS, { 
    i18n: (key, value) => app.i18n.t(key, value) 
  })
}
```

En el archivo `nuxt.config.js`, añadimos en el array de plugins un nuevo objeto para importar el plugin *ods* que hemos creado previamente.

```js
plugins: [
  {
    src: '~/plugins/ods.js',
    mode: 'client' // esto es necesario para que la librería solo se utilice en client side, ya que en el servidor de node daría error
  } 
]
```

En el mismo `nuxt.config.js` añadimos el array de *css* y de *styleResources* para *scss*:

```js
css: [
  '@onesait/ods/lib/theme-onesait/index.css',
  '@/assets/scss/main.scss'
]
styleResources: {
  scss: [
    './node_modules/@onesait/ods/packages/theme-onesait/src/common/var.scss',
    './assets/scss/base/_variables.scss',
    './assets/scss/base/_mixins.scss',
    './assets/scss/base/_typography-placeholder.scss'
  ]
}
```

Para configurar el multidioma, añadimos la dependencia a nuestro `package.json`, creamos un archivo `i18n.js` en la carpeta plugins, igual que con el *ODS*. Importamos *Vue* y *VueI18n*, seguido de los ficheros de locales.

```js
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import esOds from '@onesait/ods/lib/locale/lang/es'
import enOds from '@onesait/ods/lib/locale/lang/en'
import esLocales from '@/locale/es'
import enLocales from '@/locale/en'
Vue.use(VueI18n)

export default ({ app, store }) => {
  const messages = {
    es: {
      ...esOds,
      ...esLocales
    },
    en: {
      ...enOds,
      ...enLocales
    }
  }
  app.i18n = new VueI18n({
    locale: 'es', // o store.state.shared.locale en caso de que lo tengamos guardado en store
    fallbackLocale: 'es',
    messages
  })
}
```

Para finalizar importamos el plugin en nuxt.config.js:

```js
plugins: [
  {
    src: '~/plugins/i18n.js'
  } 
]
```