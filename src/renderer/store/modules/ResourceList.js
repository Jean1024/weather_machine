import axios from 'axios'
const state = {
	main: {
		data: {},
		showMask: false,
		dataUrl: '',
		addLabel: false,
		labelname: 0,
		labels:[]
	},
	current: {},
    mapStyle:{
        place: '',
        fillColor: 'rgba(255,255,255,1)'
    }
}
const mutations = {
  INCREMENT_MAIN_COUNTER(state, data) {
    state.main.data = data;
  },
  TOGGLE_MASK(state, data) {
    state.main.showMask = data;
  },
  CHANGE_DATA(state, data) {
    state.main.dataUrl = data;
  },
  CURRENT_DATA(state, data) {
    state.current = data;
  },
  // 添加标签
  ADD_LABEL(state, data) {
    state.main.labelname++;
    state.main.addLabel = data;
  },
  LABEL_DATA(state, data) {
    state.main.labels = data;
  },
  MAP_STYLE_CHANGE(state, data) {
    state.mapStyle = Object.assign(state.mapStyle, data);
  }
};
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
				// 天气数据
				commit('CURRENT_DATA', res.data.legends)
				commit('INCREMENT_MAIN_COUNTER', res.data.data)
				// 标签数据
				commit('LABEL_DATA',res.data.labels)
				commit('TOGGLE_MASK', false)
				// 地图覆盖数据
				commit("MAP_STYLE_CHANGE", res.data.mapOver?res.data.mapOver:{place:"",fillColor:''});
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