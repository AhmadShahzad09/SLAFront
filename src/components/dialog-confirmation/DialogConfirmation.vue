<template>
  <ods-dialog
      :visible.sync="visible"
      width="30%"
      modal
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
  >
    <div class="ods-dialog--center">
      <h3 class="alert__title ods-alert--error">
        {{$t('deleteAlert')}}
      </h3>
    </div>
    <div slot="footer">
      <ods-button size="medium" type="danger" @click="onConfirm" :loading="loading">
        {{$t('confirm')}}
      </ods-button>
      <ods-button size="medium" type="secondary" @click="onCancel" :disabled="loading">
        {{$t('cancel')}}
      </ods-button>
    </div>
  </ods-dialog>
</template>

<script>
export default {
  name: 'DialogConfirmation',
  props: {
    visible: Boolean,
    loading: Boolean,
    onConfirm: Function,
    onCancel: Function
  }
}
</script>

<style lang="scss" scoped>
  .alert__title {
    font-size: 14px;
    padding: 10px;
  }
</style>
