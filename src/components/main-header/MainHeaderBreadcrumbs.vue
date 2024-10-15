<template>
  <div
    v-if="$router"
    class="ods-main-header__breadcrumbs">
    <ods-breadcrumb :separator="separatorProp">
      <ods-breadcrumb-item
        v-for="(route, index) in this.matchedRoutes"
        :key="index"
        :to="{ name: route.name || route.redirect.name }">
        <template v-if="isPhone">
          <template v-if="(index === matchedRoutes.length-2)">
            <ods-icon name="arrow-left" size="20"/>
          </template>
          <template v-if="(index === matchedRoutes.length-1)">
            {{ route.meta.compoundBreadcrumb }}
          </template>
        </template>
        <template v-else-if="handleWidth || isTablet">
          <template v-if="
            (index === matchedRoutes.length-1)
            || (index === 0)">
            {{ route.meta.compoundBreadcrumb }}
          </template>
          <template v-else>
            <ods-tooltip
              :content="route.meta.compoundBreadcrumb"
              placement="bottom"
              popper-class="breadcrumb-tooltip"
              :enterable="false">
              <span>...</span>
            </ods-tooltip>
          </template>
        </template>
        <template v-else>
          {{ route.meta.compoundBreadcrumb }}
        </template>
      </ods-breadcrumb-item>
    </ods-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'MainHeaderBreadcrumbs',
  data () {
    return {
      matchedRoutes: [],
      separator: this.$parent.$options.propsData.breadcrumbSeparator
    }
  },

  props: {
    handleWidth: {
      type: Boolean
    },
    isPhone: {
      type: Boolean,
      default: false
    },
    isTablet: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    separatorProp () {
      return !this.isPhone ? this.separator : null
    }
  },

  watch: {
    '$route' () {
      this.routesHandler()
      this.$emit('checkWidth')
    },
    '$i18n.locale' () {
      this.routesHandler()
    }
  },

  methods: {
    routesHandler () {
      this.$nextTick(_ => {
        this.matchedRoutes = this.$route.matched
          .filter(e => e.meta.breadcrumbTextKey || e.meta.breadcrumbParam)
          .map(e => this.setBreadcrumb(e))
      })
    },
    setBreadcrumb (route) {
      if (route.meta.breadcrumbParam && route.meta.breadcrumbTextKey) {
        route.meta.compoundBreadcrumb = this.$t('breadcrumb.' + route.meta.breadcrumbTextKey) + this.$route.params[route.meta.breadcrumbParam]
      } else if (route.meta.breadcrumbParam) {
        route.meta.compoundBreadcrumb = this.$route.params[route.meta.breadcrumbParam]
      } else {
        route.meta.compoundBreadcrumb = this.$t('breadcrumb.' + route.meta.breadcrumbTextKey)
      }
      return route
    }
  },

  mounted () {
    this.routesHandler()
  }
}
</script>
