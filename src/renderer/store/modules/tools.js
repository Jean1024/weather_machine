const state = {
    style:{
        fontFamily: '',
        fontSize: '',
        color: '',
        backgroundColor: '',
        backgroundImage: '',
    },
    mapStyle:{
        place: '',
        fillColor: 'rgba(255,255,255,1)'
    }
}
const mutations = {
    STYLE_CHANGE(state,data){
        state.style = Object.assign(state.style,data)
    },
    MAP_STYLE_CHANGE(state, data) {
        state.mapStyle = Object.assign(state.mapStyle, data)
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