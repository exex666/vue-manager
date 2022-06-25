import Vue from 'vue'
import Vuex from 'vuex'
import { getAdminInfo } from '@/utils/http.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    adminInfo: window.localStorage.getItem('info') ? JSON.parse(window.localStorage.getItem('info')) : { avatar: 'default.jpg', },
  },
  mutations: {
    async getInfo(state) {
      const { data: info, } = await getAdminInfo()
      if (info.status === 1) {
        state.adminInfo = info.data
        window.localStorage.setItem('info', JSON.stringify(state.adminInfo))
      } else {
        this.logout(state)
        Vue.prototype.$message({
          type: 'warning',
          message: '获取用户信息失败',
        })
      }
    },
    logout(state) {
      state.adminInfo = {
        avatar: 'default.jpg',
      }
      window.localStorage.removeItem('info')
    },
  },
  actions: {
  },
  modules: {
  },
})
