import axios from 'axios'
const state = {
  main: {
    data:{},
    showMask: false,
    dataUrl: ''
  }
}

const mutations = {
  INCREMENT_MAIN_COUNTER (state,data) {
    state.main.data = data
  },
  TOGGLE_MASK(state,data){
    state.main.showMask = data
  },
  CHANGE_DATA(state, data) {
    state.main.dataUrl = data
  },
}

const actions = {
  someAsyncTask ({ commit },{data}) {
    commit('TOGGLE_MASK', true)
    axios.get(data.url)
    .then(res => {
      commit('INCREMENT_MAIN_COUNTER', res.data)
      commit('TOGGLE_MASK', false)
    })
  },
  refreshMap({ commit }, data) {
    commit('TOGGLE_MASK', true)
    const map = data.map
    axios.get(data.url)
      .then(res => {
        console.log(res)
        map.setView(res.data.map.center, res.data.map.zoom)
        commit('INCREMENT_MAIN_COUNTER', res.data.data)
        commit('TOGGLE_MASK', false)
      })
  }
}

export default {
  state,
  mutations,
  actions
}
