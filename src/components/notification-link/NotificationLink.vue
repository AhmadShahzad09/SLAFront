<template>
<div class="ods-notification__link-wrap">
  <p>{{ message }}</p>
  <a
    v-if="parentRouter"
    @click="navigateTo"
    class="ods-button ods-button--text">
    {{ linkText }}</a>
  <a
    v-else
    :href="href"
    target="_blank"
    class="ods-button ods-button--text">
    {{ linkText }}</a>
</div>
</template>

<script>
export default {
  name: 'OdsNotificationLink',
  version: '2.0.0',
  category: 'data',
  lastDate: '13/04/2020',
  syncStatus: 'not-applicable',

  props: {
    parentRouter: null,
    to: null,
    message: '',
    linkText: '',
    href: ''
  },
  methods: {
    navigateTo () {
      this.parentRouter.push(this.to)
    }
  }
}
</script>
