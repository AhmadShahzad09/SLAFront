<template>
  <ods-row :gutter="20">
    <ods-col :md="12">
      {{$t(title)}}
    </ods-col>
    <ods-col :md="12" class="text-right">
      <slot name="right" v-if="hasPermission">
        <router-link :to="{ name: urlKey }">
          <ods-button size="medium">
            {{$t(btnLabel)}}
          </ods-button>
        </router-link>
      </slot>
    </ods-col>
  </ods-row>
</template>

<script>
export default {
  name: 'ListHeader',
  props: {
    title: String,
    urlKey: String,
    btnLabel: String,
    hasPermission: {
      type: Boolean,
      default: true
    }
  }
}
</script>
