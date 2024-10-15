<template>
  <ods-button
      size="mini"
      type="primary"
      @click="$emit('click')">
    <ods-icon name="edit" v-if="icon" style="margin-left: 0"/>
    <span v-else>
      {{$t('edit')}}}}
    </span>
  </ods-button>
</template>

<script>

export default {
  name: 'TableEdit',
  props: {
    icon: {
      type: Boolean,
      default: true
    }
  }
}
</script>
