let SITE = 'https://tqwy.tianqi.cn/tianqixy'

if (process.env.NODE_ENV !== 'production') {
    SITE = '/tianqixy'
}


// 设备信息修改 {...}
const UPDATE_DEVICE = `${SITE}/userInfo/faciliup`
export default {
    UPDATE_DEVICE
}