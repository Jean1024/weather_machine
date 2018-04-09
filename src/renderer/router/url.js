let SITE = 'https://tqwy.tianqi.cn/tianqixy'

if (process.env.NODE_ENV !== 'production') {
    SITE = '/tianqixy'
}
// 1.0 降水实况图例
const LEGEND_BASE_SK = "http://61.4.184.177:7799/legend/sk/"
// 1.1 降水实况数据
const JS_DATA = "https://decisionappjson.tianqi.cn/js_data/china/"

// 天气数据列表
const WEATHER_MENU = {
    JS: {
        url: `${JS_DATA}precipitation1h.json`,
        legend: `${LEGEND_BASE_SK}precipitation1h.png`
    },
    WD: {
        url: `${JS_DATA}precipitation1h.json`,
        legend: `${LEGEND_BASE_SK}sk_wd.png`
    }
}

// 设备信息修改 {...}
const UPDATE_DEVICE = `${SITE}/userInfo/faciliup`
export default {
    UPDATE_DEVICE,
    WEATHER_MENU,
}