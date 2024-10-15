<template>
  <div>
    <slot name="filters" v-bind:filterData="handleFilters">
    </slot>
    <ods-table
        v-loading="loading"
        :data="data"
        @sort-change="handleSort"
        :default-sort = "defaultSort"
        style="width: 100%">
      <slot></slot>
    </ods-table>
    <div class="block">
      <ods-pagination
          :total="total"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          layout="prev, pager, next, jumper, sizes, ->, total"
      >
      </ods-pagination>
    </div>
  </div>
</template>

<script>
import map from 'lodash/map'

export default {
  name: 'AsyncTable',
  props: {
    data: Array,
    total: Number,
    loading: Boolean,
    pageStartZero: Boolean,
    defaultSort: Object
  },
  mounted: function () {
    this.getData({ sort: this.sort, offset: this.pageIndex, limit: this.pageSize })
  },
  data () {
    return {
      pageIndex: 0,
      pageSize: 10,
      sort: null,
      filters: {}
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    handlePageChange (val) {
      this.pageIndex = val - 1
      this.getData()
    },
    handleFilters (filters) {
      this.filters = {}
      map(filters, (filter, key) => {
        if (filter) this.filters[`filters[${key}]`] = filter
      })

      this.getData()
    },
    handleSort (val) {
      this.sort = { prop: val.prop, order: val.order }
      this.getData()
    },
    async getData () {
      const params = {
        offset: this.pageIndex === 0 && this.pageStartZero ? 0 : (this.pageIndex * this.pageSize),
        limit: this.pageSize,
        ...this.filters
      }
      if (this.sort && this.sort.prop) params[`sortby[${this.sort.prop}]`] = this.sort.order === 'ascending' ? 'ASC' : 'DESC'

      this.$emit('fetchData', params)
    }
  }
}
</script>
