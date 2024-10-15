<template>
  <ods-button
      size="mini"
      type="danger"
      :disabled="disabled"
      @click="$emit('click')">
    <ods-icon name="close" v-if="icon" style="margin-left: 0"/>
    <span v-else>
      {{$t('delete')}}}}
    </span>
  </ods-button>
</template>

<script>

export default {
  name: 'TableDelete',
  props: {
    icon: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
