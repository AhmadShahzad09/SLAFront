<template>
  <li class="ods-breadcrumb__item">
    <router-link
      tag="a"
      :to="to || ''"
      :replace="replace"
      :class="['ods-breadcrumb__inner', to ? 'is-link' : '']">
      <slot></slot>
    </router-link>
    <i v-if="separatorClass" class="ods-breadcrumb__separator" :class="separatorClass"></i>
    <span v-else class="ods-breadcrumb__separator" role="presentation">{{separator}}</span>
  </li>
</template>
<script>
export default {
  name: 'OdsBreadcrumbItem',
  props: {
    to: {},
    replace: Boolean
  },
  data () {
    return {
      separator: '',
      separatorClass: ''
    }
  },

  inject: ['odsBreadcrumb'],

  watch: {
    'odsBreadcrumb.separator' (val) {
      this.separator = val
    },
    'odsBreadcrumb.separatorClass' (val) {
      this.separatorClass = val
    }
  },

  mounted () {
    this.separator = this.odsBreadcrumb.separator
    this.separatorClass = this.odsBreadcrumb.separatorClass
  }
}
</script>
