<template>
  <ods-row :gutter="20" style="font-size: 12px; font-weight: normal" class="mt-1">
    <ods-col :md="12">
      <p class="font-weight-bold" style="margin-bottom: 0.5rem">{{$t('number')}}:</p>
      <p>{{data.serialNumber}}</p>
    </ods-col>
    <ods-col :md="6" v-if="data.brand">
      <p class="font-weight-bold" style="margin-bottom: 0.5rem">{{$t('brand')}}:</p>
      <p>{{data.brand.description}}</p>
    </ods-col>
    <ods-col :md="6" v-if="data.model">
      <p class="font-weight-bold" style="margin-bottom: 0.5rem">{{$t('model')}}:</p>
      <p>{{data.model.description}}</p>
    </ods-col>
  </ods-row>
</template>

<script>
export default {
  name: 'MeterOverview',
  props: {
    data: Object
  }
}
</script>
