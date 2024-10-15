<template>
  <nav data-name="OdsBreadcrumb" class="ods-breadcrumb" aria-label="breadcrumb" role="navigation">
    <ul>
      <slot></slot>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'OdsBreadcrumb',
  version: '2.0.1',
  category: 'navigation',
  lastDate: '13/04/2020',
  syncStatus: 'aligned',
  props: {
    separator: {
      type: String,
      default: '/'
    },
    separatorClass: {
      type: String,
      default: ''
    }
  },

  provide () {
    return {
      odsBreadcrumb: this
    }
  },

  /* watch: {
      'separator' (val) {
        this.separator = val
      },
      'separatorClass' (val) {
        this.separatorClass = val
        console.log(this.separatorClass)
      }
    }, */

  mounted () {
    const items = this.$el.querySelectorAll('.ods-breadcrumb__item')
    if (items.length) {
      items[items.length - 1].setAttribute('aria-current', 'page')
    }
  }
}
</script>
