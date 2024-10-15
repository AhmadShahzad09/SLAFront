import handlePromise from '@/utils/promise'

const asyncTableCommon = {
  data: function () {
    return {
      data: [],
      total: 0,
      loading: true,
      tableParams: null
    }
  },
  methods: {
    async getData (params) {
      this.loading = true

      const [error, response, data] = await handlePromise(this.promise(params))
      this.loading = false
      if (!response.ok) return this.$store.commit('settings/toggleAlert', error)

      this.data = data.data
      this.total = data.total
      this.tableParams = params
    }
  }
}

export default asyncTableCommon
