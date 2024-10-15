<template>
  <ods-dialog :visible.sync="visible" width="30%" modal center :close-on-click-modal="false"
    :close-on-press-escape="false" :before-close="handleClose">
    <div class="ods-dialog--center">
      <h3 v-if="!text" :class="'alert__title ods-alert--' + alertTextBoxType">
        {{ $t('deleteAlert') }}
      </h3>
      <h3 v-if="text" :class="'alert__title ods-alert--' + alertTextBoxType">
        {{ $t(text) }}
      </h3>
    </div>
    <div slot="footer">
      <ods-button size="medium" type="danger" @click="$emit('confirm')" :loading="loading" :disabled="disableConfirm">
        {{ $t('confirm') }}
      </ods-button>
      <ods-button size="medium" type="secondary" @click="$emit('cancel')" :disabled="loading">
        {{ $t('cancel') }}
      </ods-button>
    </div>
  </ods-dialog>
</template>

<script>
export default {
  name: 'DialogConfirmation',
  props: {
    text: String,
    alertTextBoxType: {
      type: String,
      default: 'error'
    },
    visible: Boolean,
    loading: Boolean,
    disableConfirm: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClose () {
      if (!this.loading) this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.alert__title {
  font-size: 14px;
  padding: 10px;
}
</style>
