const state = {
    style:{
        fontFamily: '',
        fontSize: '',
        color: '',
        backgroundColor: '',
    }
}
const mutations = {
    STYLE_CHANGE(state,data){
        state.style = Object.assign(state.style,data)
    }
}
const actions = {
    ttttt({commit,state}, data) {
        commit('TOGGLE_MASK', true)
    },
}

export default {
    state,
    mutations,
    actions
}