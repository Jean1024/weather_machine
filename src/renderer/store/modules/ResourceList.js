import axios from 'axios'
const state = {
  main: {
    data:{},
  }
}

const mutations = {
  INCREMENT_MAIN_COUNTER (state,data) {
    state.main.data = data
  }
}

const actions = {
  someAsyncTask ({ commit },{data}) {
    axios.get(data.url)
    .then(res => {
      commit('INCREMENT_MAIN_COUNTER',res.data)
    })
  }
}

export default {
  state,
  mutations,
  actions
}
