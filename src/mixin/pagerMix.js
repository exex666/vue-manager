import Pager from '@/components/pager.vue'
export const pager = {
  components: {
    Pager,
  },
  data() {
    return {
      listData: [],
      params: {},
      extend: false,
      page: 1,
      limit: 20,
      count: 0,
      allPage: 1,
    }
  },
  mounted() {
  },
  computed: {
    offset() {
      return (this.page - 1) * this.limit
    },
  },
  methods: {
    pageChange(e) {
      this.page = e.value
      this.getData()
    },
    async initTable(extend = false, params = {}) {
      const { data: count, } = await this.getCount()
      this.count = count.count
      this.allPage = Math.ceil(this.count / this.limit)
      this.extend = extend
      this.params = params
      this.getData()
    },
    async getData() {
      const params = {
        offset: this.offset,
        limit: this.limit,
      }
      for (const key in this.params) {
        params[key] = this.params[key]
      }
      const { data, } = await this.getList(params)
      if (this.extend === true) {
        this.listData = data.map(val => {
          val.expand = false
          return val
        })
      } else {
        this.listData = data
      }
    },
  },
}
