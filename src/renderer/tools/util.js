// 截屏保存图片
const electron = require('electron')
const desktopCapturer = electron.desktopCapturer
const electronScreen = electron.screen
const shell = electron.shell
const path = require('path')
const fs = require('fs')
const os = require('os')

const screenshot = document.getElementById('screenshot')
const imgDir = path.join(os.tmpdir(), 'machine')
fs.mkdir(imgDir, function (err) {
    if (err) {
        // throw err;  
        return;
    }
});
function draw(map,group,data) {
    const result = data.l
    result.forEach(function (v) {
        const color = `rgba(${v.c.join(',')})`
        let arr = v.p.split(';')
        arr = arr.map(function (v) {
            return v.split(',').reverse()
        })
        group.addLayer(L.polygon(arr, {
            color,
            stroke: false,
            fillOpacity: 0.6,
            smoothFactor: 0
        }))
        group.addTo(map)
    })
}
function getTime() {
    var myDate = new Date();
    var y = myDate.getFullYear();
    var m = myDate.getMonth() + 1;
    m = m < 10 ? '0' + m : m
    var d = myDate.getDate();
    d = d < 10 ? '0' + d : d
    var h = myDate.getHours();
    h = h < 10 ? '0' + h : h
    var M = myDate.getMinutes();
    M = M < 10 ? '0' + M : M
    var s = myDate.getSeconds();
    s = s < 10 ? '0' + s : s
    var random = ~~(Math.random() * 1000)
    return '' + y + m + d + h + M + s + random
}
function shoot(cb) {
    const thumbSize = determineScreenShotSize()
    let options = { types: ['screen'], thumbnailSize: thumbSize }
    desktopCapturer.getSources(options, function (error, sources) {
        if (error) return console.log(error)
        // sources.forEach(function (source, i) {
            const source = sources[0]
            const _t = getTime()
            const screenshotPath = path.join(imgDir, _t + '.png')
            fs.writeFile(screenshotPath, source.thumbnail.toPng(), function (error) {
                if (error) alert('保存图片出错')
                // shell.openExternal('file://' + screenshotPath)
                // shell.showItemInFolder(screenshotPath)
                // alert(_t + '.png 保存成功!')
                cb()
            })
        // })
    })
}
function determineScreenShotSize() {
    const screenSize = electronScreen.getPrimaryDisplay().workAreaSize
    const maxDimension = Math.max(screenSize.width, screenSize.height)
    return {
        width: maxDimension * window.devicePixelRatio,
        height: maxDimension * window.devicePixelRatio
    }
}
module.exports = {
    draw,
    shoot,
}