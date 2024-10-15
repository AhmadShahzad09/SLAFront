<template>
  <transition name="ods-loading-fade" @after-leave="handleAfterLeave">
    <div
      role="alert"
      aria-live="assertive"
      data-name="OdsLoading"
      v-show="visible"
      class="ods-loading-mask"
      :style="{ backgroundColor: background || '' }"
      :class="[customClass, { 'is-fullscreen': fullscreen }]">
      <div class="ods-loading-spinner">
        <svg v-if="spinner==='circular'" class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none"/>
        </svg>
        <span v-else-if="spinner==='load'" class="ods-icon-loading"/>
        <span v-else class="pulse"/>
        <div class="loading-text-wrapper" :class="{'white-text': whiteText }">
          <p v-if="text" class="ods-loading-text">{{ text }}</p>
          <p v-if="!text && title" class="ods-loading-title">{{ title }}</p>
          <p v-if="!text && description" class="ods-loading-description">{{ description }}</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'OdsLoading',
  version: '2.0.0',
  category: 'data',
  lastDate: '13/04/2020',
  syncStatus: 'aligned-extended',
  data () {
    return {
      text: null,
      title: null,
      description: null,
      spinner: null,
      background: null,
      fullscreen: true,
      visible: false,
      customClass: '',
      whiteText: false
    }
  },

  methods: {
    handleAfterLeave () {
      this.$emit('after-leave')
    },
    setText (text) {
      this.text = text
    },
    setTitle (title) {
      this.title = title
    },
    setDescription (description) {
      this.description = description
    }
  },
  mounted () {
    if (this.whiteText !== null && this.whiteText !== false) {
      this.whiteText = true
    }
  }
}
</script>
