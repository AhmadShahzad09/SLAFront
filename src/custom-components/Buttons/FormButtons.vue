<template>
  <ods-row type="flex" justify="center">
    <ods-button type="primary" class="mr-1" @click="$emit('submit')" :loading="loading" :disabled="disabledSubmit">
      {{ $t(submitText) }}
    </ods-button>
    <router-link :to="{ name: cancelTo }" v-if="cancelTo">
      <ods-button type="secondary">{{ $t(cancelText) }}</ods-button>
    </router-link>
    <ods-button type="secondary" :disabled="loading" v-if="!cancelTo" @click="$emit('cancel')">
      {{ $t(cancelText) }}
    </ods-button>
  </ods-row>
</template>

<script>

export default {
  name: 'FormButtons',
  props: {
    loading: Boolean,
    cancelTo: String,
    form: {},
    cancelText: {
      type: String,
      default: 'cancel'
    },
    submitText: {
      type: String,
      default: 'save'
    },
    disabledSubmit: {
      type: Boolean,
      default: false
    }
  }
}
</script>
