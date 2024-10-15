<template>
  <ods-col :md="colSize" style="min-height: 100%;">
    <ods-module :header="$t(header)" style="min-height: 100%">
      <ods-row type="flex" justify="center" style="margin-top: 2rem">
        <ods-icon name="info" size="100" class="custom-placeholder"/>
      </ods-row>
    </ods-module>
  </ods-col>
</template>

<script>

export default {
  name: 'ModulePlaceholder',
  props: {
    header: String,
    colSize: Number
  }
}
</script>
