const path = require('path')
const fs = require('fs')
const os = require('os')
function refresh() {
    const imgDir = path.join(os.tmpdir(), 'machine')
    const imgs = fs.readdirSync(imgDir)
    const arr = []
    imgs.forEach((item, index) => {
        const _path = path.join(imgDir, item)
        arr[index] = {
            img: _path
        }
    })
    return arr
}
const _arr = refresh()
const state = {
    imgs: {
        data: _arr
    }
}
const mutations = {
    ADD_IMG(state, data) {
        state.imgs.data = data
    }
}

const actions = {
    refreshIMGS({ commit }) {
        const arr = refresh()
        commit('ADD_IMG', arr)
    }
}

export default {
    state,
    mutations,
    actions
}
