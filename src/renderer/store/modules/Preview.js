const path = require('path')
const fs = require('fs')
const os = require('os')
function refresh() {
    const imgDir = path.join(os.tmpdir(), 'machine')
    const imgs = fs.readdirSync(imgDir).filter(item=>{
        return item.indexOf('.png') > -1
    })
    const arr = []
    imgs.forEach((item, index) => {
        const _path = path.join(imgDir, item)
        arr[index] = {
            img: "file:///" + _path
        }
    })
    return arr
}
const _arr = refresh()
const state = {
    imgs: {
        data: _arr
    },
    fz: 16
}
const mutations = {
    ADD_IMG(state, data) {
        state.imgs.data = data
    },
    CHANGE_FZ(state, data){
        state.fz = data
    }
}
const actions = {
    refreshIMGS({ commit }) {
        const arr = refresh()
        commit('ADD_IMG', arr)
    },
    delImg({commit},data){
        data = data.replace('file:///','')
        const jsonUrl = data.replace('.png','.json')
        let index = 0
        fs.unlink(data, function (err) {
            if (err) return console.log(err);
            index++
            if(index === 2){
                const arr = refresh()
                commit('ADD_IMG', arr)
            }
        })
        fs.unlink(jsonUrl, function (err) {
            if (err) return console.log(err); 
            index++
            if (index === 2) {
                const arr = refresh()
                commit('ADD_IMG', arr)
            }
        })
    }
}

export default {
    state,
    mutations,
    actions
}
