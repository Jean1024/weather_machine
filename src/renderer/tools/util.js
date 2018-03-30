
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
module.exports = {
    draw
}