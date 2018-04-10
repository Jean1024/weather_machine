import axios from 'axios'
const state = {
	main: {
		data: {},
		showMask: false,
		dataUrl: '',
		addLabel: false,
	},
	current: {},
}
const mutations = {
	INCREMENT_MAIN_COUNTER(state, data) {
		state.main.data = data
	},
	TOGGLE_MASK(state, data) {
		state.main.showMask = data
	},
	CHANGE_DATA(state, data) {
		state.main.dataUrl = data
	},
	CURRENT_DATA(state, data) {
		state.current = data
	},
	// 添加标签
	ADD_LABEL(state, data) {
		state.main.addLabel = data
	}
}
const actions = {
	// 获取接口数据
	someAsyncTask({
		commit
	}, {
		data
	}) {
		commit('TOGGLE_MASK', true)
		commit("CURRENT_DATA", data)
		axios.get(data.url)
			.then(res => {
				commit('INCREMENT_MAIN_COUNTER', res.data)
				commit('TOGGLE_MASK', false)
			})
	},
	// 获取版本数据
	refreshMap({
		commit
	}, data) {
		commit('TOGGLE_MASK', true)
		const map = data.map
		axios.get(data.url)
			.then(res => {
				map.setView(res.data.map.center, res.data.map.zoom)
				commit('CURRENT_DATA', res.data.legends)
				commit('INCREMENT_MAIN_COUNTER', res.data.data)
				commit('TOGGLE_MASK', false)
			})
	},
	// 刷新数据
	refreshData({
		commit,
		state
	}, data) {
		commit('TOGGLE_MASK', true)
		axios.get(state.current.url)
			.then(res => {
				commit('INCREMENT_MAIN_COUNTER', res.data)
				commit('TOGGLE_MASK', false)
			})
	},
}

export default {
	state,
	mutations,
	actions
}