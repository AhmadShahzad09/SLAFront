<template>
  <ods-button
      size="mini"
      type="warning"
      @click="$emit('click')">
    <ods-icon name="calendar-schedule" v-if="icon" style="margin-left: 0"/>
    <span v-else>
      {{$t('edit')}}}}
    </span>
  </ods-button>
</template>

<script>

export default {
  name: 'TableHistory',
  props: {
    icon: {
      type: Boolean,
      default: true
    }
  }
}
</script>
