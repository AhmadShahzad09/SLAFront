# ODS.js | Guía de contribución

> Guía para la contribución opensource a la librería de componentes del sistema de diseño de Onesait UX

## Reporte de issues

La primera forma de contribuir a la librería del sistema de componentes es identificar bugs y funcionalidades interesantes que puedan aportar a esta y documentarlos en forma de [issues], para que cualquier desarrollador que se anime pueda resolverlos e implementar los cambios.

Para reportar un **bug** en la librería o proponer una **nueva funcionalidad** (ya sea una funcionalidad para un componente o un componente nuevo) es necesario [crear un issue][new-issue] siguiendo las plantillas que están a nuestra disposición en [esta carpeta][templates]. Para ello basta con seleccionar la plantilla correspondiente en el desplegable que aparece junto a la etiqueta *descripción* a la hora de crear un nuevo Issue o MR. Esto rellenará el contenido de la descripción automáticamente con la plantilla seleccionada, de modo que sólo quedará rellenar los campos correspondientes con los detalles de nuestro Issue o MR y borrar aquellos que no vayan a utilizarse. Recomendamos hacer uso de la pestaña **preview** antes de publicar la request para comprobar que ha quedado [como se espera][bug-use-case].

El uso de estas plantillas es obligatorio, y no se aceptarán issues que no sigan las líneas de contribución del sistema. Es importante mantener un nivel de estandarización en este sentido ya que ayuda a agilizar la contribución y permite que los bugs se resuelvan de manera eficiente. **Los issues que se reporten sin seguir estas plantillas serán cerrados automáticamente y no serán atendidos.**

Mientras que el uso de las plantillas es obligatorio, el contenido de cada issue depende de aquel que lo abra y es libre de incluir el nivel de detalle que considere. Aun así recomendamos dar el mayor número de detalles posible para que quien vaya a encargarse de resolverlo tenga toda la información necesaria disponible en el propio issue y no se vea obligado a preguntar. Si un issue está bien documentado será mucho más fácil de resolver y el tiempo que pueda pasar desde que se hace el reporte hasta que se solucione será mucho menor.

A la hora de reportar un nuevo issue hay que saber identificar si se trata de un **bug** del sistema de componentes, de una **nueva funcionalidad**, o de un cambio en la documentación de la librería. Cada uno de estos tipos de issue tiene su propia plantilla, adaptada a las necesidades de estos.

>  Las plantillas son también parte de la librería y en principio deberían ser suficientes para cubrir >90% de los issues que se vayan a abrir, pero si se echan en falta plantillas para algún tipo de issue más, o se quieren proponer cambios/mejoras sobre las existentes, siempre se puede abrir un issue de *documentación* y hacer la propuesta.

Las tres plantillas disponibles son:

- Plantilla para reportar **bugs** ([ver plantilla][bug-template] / [ver caso de uso][bug-use-case])
- Plantilla para reportar **nuevas features**  ([ver plantilla][feature-template])
- Plantilla para reportar **cambios en la documentación** ([ver plantilla][doc-template] / [ver caso de uso][doc-use-case])

Por regla general los campos de estas plantillas son obligatorios, y deberían rellenarse con la información correspondiente, excluyendo aquellos en los que se especifique que no lo son (p.ej: '... si aplica' o '... si hubiera'), en cuyo caso pueden omitirse y debería borrarse el *campo* o la *sección* entera para no añadir ruido. Cada sección del markdown incluye una descripción del contenido[^1] que debería incluir y se recomienda hacer uso de todas las opciones que ofrece markdown para formatear el contenido del issue de forma que facilite su lectura y entendimiento. Si surge alguna duda acerca de cómo rellenar un campo o una sección siempre puede recurrirse al [canal de slack][slack] para consultar.

> Si no estás familiarizado con el lenguaje markdown puedes consultar [esta guía][md-guide] (genérica de .md) o [esta otra][gitlab-md-guide] con la sintaxis de markdown que utiliza Gitlab que añade funcionalidad sobre la sintaxis base (exclusiva de Gitlab).

## Resolución de issues a través de merge requests

La segunda forma de contribuir consiste en resolver aquellos issues que hayan sido reportados previamente.

El primer paso es clonar el repositorio de la librería de componentes.

```sh
$ git clone http://gitlab.devops.onesait.com/onesait/onesait-ux/ods.git ods
$ cd ods && git pull
```

Tras identificar el issue que se quiere resolver debe abrirse una nueva rama desde la versión más actualizada de la rama `develop`. El nombre de la rama debe indicar qué tipo de issue se esta resolviendo (`bugfix/`, `feature/` o `docs/`) seguido del nombre del componente, el archivo de documentación o cualquier texto que describa brevemente el contenido de la rama.

```sh
# p.ej
- feature/ods-new-component
- bugfix/ods-input
- docs/readme
```

Recomendamos abrir la merge request (MR) lo antes posible, e ir documentando en esta los cambios que se vayan haciendo si es necesario. Esta forma de trabajar permite a la comunidad aportar ideas y hacer comentarios sobre el desarrollo del fix o la feature en los comentarios de la merge request a lo largo de la vida de esta.

La descripción de la MR debe ser rellenada utilizando [esta plantilla][mr-template] (seleccionándola en el desplegable que aparece junto a la etiqueta *descripción*), y el título debe hacer referencia[^2] al issue que resuelve la MR. Al utilizar la plantilla, la MR se marcará con el estado `WIP` ([work in progress][gitlab-wip]) automáticamente. Esto protege la MR mientras se esté desarrollando y sólo debemos resolver este estado cuando esté lista para ser mergeada. De esta forma evitamos que se cierra antes de tiempo.

El título de la MR debe tener una de las siguientes formas.

```md
WIP: Eventos del componente ods-button - Resolves #4
- ó -
WIP: Eventos del componente ods-button - Related to #4
```

⚠️ Debemos utilizar **Resolves** si la MR cierra por completo el issue relacionado. Es importante que escribamos **Resolves** tal cual ya que esto ayuda a cerrar automáticamente el issue cuando la MR sea resuelta. Si nuestra MR no cierra por completo el issue relacionado sino que contribuye a cerrar sólo parte de este, debemos utilizar **Related to** para que Gitlab relacione la MR con el issue pero no lo cierre al resolver la MR.

La plantilla incluye también un control de contribución que ayuda a asegurarnos de que se cumplen los requisitos mínimos de la MR para que no la demos por finalizada antes de tiempo. Entre estos requisitos están:

- **La MR debe estar hecha desde y hacia la rama `develop`.**
- **El issue que resuelve está bien enlazado y el título sigue con el formato propuesto.**
- **El código que implementa la MR está probado y cumple los requisitos de cobertura.**
- **El código que implementa no rompe código existente.**

> Todas estas tareas deben estar marcadas antes de poder integrar la MR. Las dos últimas solo aplican a MR relativas a bugs o a features.

Una vez se termine de implementar el código de la MR se resolverá el estado `WIP` (bien editando el título o mediante el botón) y ésta será revisada por los responsables de la librería que podrán hacer comentarios con cambios o mejoras para garantizar que el código que aporta la MR cumple con los estándares de la librería.

Para facilitar el desarrollo de fixes o de nuevos componentes hemos creado un entorno de desarrollo, habilitando un [directorio][views] con vistas donde podremos simular un proyecto real. Por defecto es una vista donde cargamos un menú básico, con su correspondiente `.json` que lo construye, con una base `ComponentView` en la que podremos trabajar ágilmente, siendo libres de ampliar dicha estructura.

⚠️ **Es importante que los cambios en esta carpeta no se suban a *Gitlab*, ya que son solo archivos de desarrollo que no afectan a la librería.**

[issues]: https://docs.gitlab.com/ee/user/project/issues/
[slack]: https://minsait-team.slack.com/archives/G8YUR6P6K
[views]: src/views

[new-issue]: http://gitlab.devops.onesait.com/onesait/onesait-ux/ods/issues/new

[templates]: .gitlab
[bug-template]: .gitlab/issue_templates/Bug.md
[feature-template]: .gitlab/issue_templates/Feature.md
[doc-template]: .gitlab/issue_templates/Documentation.md
[mr-template]: .gitlab/merge_request_templates/Merge%20Request.md

[bug-use-case]: https://gitlab.devops.onesait.com/onesait/onesait-ux/ods/-/issues/4
[doc-use-case]: https://gitlab.devops.onesait.com/onesait/onesait-ux/ods/-/issues/3

[md-guide]: https://www.markdownguide.org/basic-syntax/
[gitlab-md-guide]: https://docs.gitlab.com/ee/user/markdown.html

[gitlab-refs]: https://about.gitlab.com/blog/2016/03/08/gitlab-tutorial-its-all-connected/
[gitlab-wip]: https://docs.gitlab.com/ee/user/project/merge_requests/work_in_progress_merge_requests.html

---

[^1]: Estas descripciones están escritas en forma de `quote` (utilizando > en la sintaxis de Markdown). Debe borrarse esta descripción y escribir el nuevo contenido sin utilizar el formato `quote`.

[^2]: Para hacer referencia a un issue en gitlab se utiliza la almohadilla (#) seguida del número del issue al que queremos hacer referencia. Más info [aquí](gitlab-refs).
