import Vue from 'vue'
import Vuex from 'vuex'
import { asyncRoutes, constantRoutes } from '@/router'
import {filterAsyncRoutes} from '@/utils/permission'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    collapse: localStorage.getItem('collapse') ? !!+localStorage.getItem('collapse') : false,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {},
    routes: [],
    addRoutes: []
  },


  actions: {
    generateRoutes({ commit }, roles) {
      return new Promise(resolve => {
        let accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  },


  mutations: {
    SET_COLLAPSE: (state) => {
      state.collapse = !state.collapse
      localStorage.setItem("collapse",state.collapse === true ? 1 : 0)
    },
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    LOGIN: (state,user) => {
      state.user = user;
      localStorage.setItem('user',JSON.stringify(user))
    },
    LOGOUT: (state) => {
      state.user = {};
      state.addRoutes = {};
      state.routes = {};
      localStorage.removeItem('user')
    }
  }

})
